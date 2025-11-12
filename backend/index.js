const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const PostRoutes = require("./routes/PostRoutes")
const path = require("path")
const ContactRoutes = require("./routes/ContactRoutes")
const SecureRoutes = require("./routes/admin")
const SubsRoutes = require("./routes/subs")
const { applySecurityMiddlewares, applyLoggingMiddleware } = require("./middlewares/SecurityChain")
const checkVPN = require("./middlewares/checkVPN")
const { CheckUserAgent } = require("./middlewares/userAgent")
const logVisit = require("./middlewares/logVisit")
const StatRoutes = require("./routes/stats")
const NoteRoutes = require("./routes/notes")
require("dotenv").config()
const axios = require("axios")
const http = require("http");
const { Server } = require("socket.io");
const MarketRoutes = require("./routes/market")
const app = express()

db()

const corsOptions = {
  origin: ["https://toprak.xyz", "https://api.toprak.xyz", "http://localhost:5173"],
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json())
app.set("trust proxy", 1)

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

applySecurityMiddlewares(app)
applyLoggingMiddleware(app)
app.use(checkVPN)
app.use(CheckUserAgent)
app.use(logVisit)
// Seucre

const questions = [
  { id: "q1", question: "Türkiye'nin başkenti neresidir?", options: ["İstanbul", "Ankara", "İzmir"], answer: 1 },
  { id: "q2", question: "Atatürk hangi yılda doğmuştur?", options: ["1881", "1879", "1885"], answer: 0 },
  { id: "q3", question: "Dünyanın en uzun nehri hangisidir?", options: ["Nil", "Amazon", "Fırat"], answer: 0 },
  { id: "q4", question: "Hangi gezegen 'Kızıl Gezegen' olarak bilinir?", options: ["Mars", "Venüs", "Jüpiter"], answer: 0 },
  { id: "q5", question: "Türkiye'nin en yüksek dağı hangisidir?", options: ["Erciyes", "Kaçkar", "Ağrı Dağı"], answer: 2 },
  { id: "q6", question: "Hangi şehir 'Işıklar Şehri' olarak bilinir?", options: ["Roma", "Paris", "Londra"], answer: 1 },
  { id: "q7", question: "Osmanlı Devleti ne zaman yıkılmıştır?", options: ["1918", "1920", "1922"], answer: 2 },
  { id: "q8", question: "Hangisi bir programlama dilidir?", options: ["Python", "Photoshop", "Excel"], answer: 0 },
  { id: "q9", question: "Türkiye'nin en büyük gölü hangisidir?", options: ["Van Gölü", "Tuz Gölü", "Beyşehir Gölü"], answer: 0 },
  { id: "q10", question: "İstanbul hangi iki kıtayı birbirine bağlar?", options: ["Asya ve Avrupa", "Avrupa ve Afrika", "Asya ve Amerika"], answer: 0 },
  { id: "q11", question: "Hangisi bir dizi karakteridir?", options: ["Heisenberg", "Tesla", "Einstein"], answer: 0 },
  { id: "q12", question: "Türk lirasının kısaltması nedir?", options: ["TL", "TRY", "₺"], answer: 2 },
  { id: "q13", question: "En hızlı koşan hayvan hangisidir?", options: ["Çita", "Aslan", "At"], answer: 0 },
  { id: "q14", question: "Hangisi bir web tarayıcısı değildir?", options: ["Chrome", "Firefox", "Instagram"], answer: 2 },
  { id: "q15", question: "Türk bayrağındaki yıldızın köşesi kaçtır?", options: ["5", "6", "8"], answer: 0 },
  { id: "q16", question: "Hangisi Karadeniz'e kıyısı olan bir ülkedir?", options: ["Romanya", "Avusturya", "Macaristan"], answer: 0 },
  { id: "q17", question: "İlk Türk astronotun adı nedir?", options: ["Alper Gezeravcı", "Barış Manço", "Haluk Levent"], answer: 0 },
  { id: "q18", question: "Hangisi yenilenebilir enerji kaynağıdır?", options: ["Kömür", "Rüzgar", "Doğalgaz"], answer: 1 },
  { id: "q19", question: "Türkiye hangi kıtada yer alır?", options: ["Asya", "Avrupa", "İkisi de"], answer: 2 },
  { id: "q20", question: "Hangisi bir yapay zeka modelidir?", options: ["GPT", "HTTP", "USB"], answer: 0 },
];



let queue = [];
let rooms = {};

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("setUsername", ({ username }) => {
    socket.username = username || "Player";
  });

  socket.on("joinQueue", () => {
    queue.push(socket);
    if (queue.length >= 2) {
      const player1 = queue.shift();
      const player2 = queue.shift();
      const roomId = `room-${player1.id}-${player2.id}`;
      const question = questions[Math.floor(Math.random() * questions.length)];

      rooms[roomId] = {
        players: [player1.id, player2.id],
        question,
        winner: null,
      };

      player1.join(roomId);
      player2.join(roomId);

      io.to(roomId).emit("matchStart", {
        roomId,
        question,
        players: [
          { id: player1.id, username: player1.username },
          { id: player2.id, username: player2.username },
        ],
      });
    } else {
      socket.emit("waiting", { message: "Waiting for second player..." });
    }
  });

  socket.on("answer", ({ roomId, answer }) => {
    const room = rooms[roomId];
    if (!room || room.winner) return;

    const correct = room.question.answer === answer;
    room.winner = correct ? socket.id : room.players.find((p) => p !== socket.id);

    io.to(roomId).emit("roundEnd", { winner: room.winner, correct });

    setTimeout(() => {
      if (!rooms[roomId]) return;
      const newQuestion = questions[Math.floor(Math.random() * questions.length)];
      rooms[roomId].question = newQuestion;
      rooms[roomId].winner = null;

      const [p1, p2] = room.players.map((id) => {
        const s = io.sockets.sockets.get(id);
        return { id: s.id, username: s.username };
      });

      io.to(roomId).emit("matchStart", {
        roomId,
        question: newQuestion,
        players: [p1, p2],
      });
    }, 5000);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    queue = queue.filter((s) => s.id !== socket.id);

    for (const r in rooms) {
      if (rooms[r].players.includes(socket.id)) {
        const otherPlayerId = rooms[r].players.find((p) => p !== socket.id);
        if (otherPlayerId) {
          io.to(otherPlayerId).emit("opponentLeft", { message: "Opponent disconnected!" });
        }
        delete rooms[r];
      }
    }
  });
});


app.use("/api/note", NoteRoutes)
require("./routes/market")(io)
// app.use("/api/market", MarketRoutes)
app.use('/api/post', PostRoutes)
app.use('/api/contact', ContactRoutes)
app.use("/api/stats", StatRoutes)
app.use('/uploads', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express.static(path.join(__dirname, 'uploads')));
app.use('/api', SecureRoutes)
app.use('/api/subs', SubsRoutes)

app.get('/', (req, res) => {
  res.send('API Is working!!');
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server runnig at: ${PORT}`)
})