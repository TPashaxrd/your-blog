const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const PostRoutes = require("./routes/PostRoutes")
const path = require("path")
const ContactRoutes = require("./routes/ContactRoutes")
const SecureRoutes = require("./routes/admin")
const SubsRoutes = require("./routes/subs")
const { applySecurityMiddlewares, applyLoggingMiddleware, setupRequestLogger } = require("./middlewares/SecurityChain")
const checkVPN = require("./middlewares/checkVPN")
const { CheckUserAgent } = require("./middlewares/userAgent")
const app = express()

db()

const corsOptions = {
  origin: ["https://toprak.xyz", "https://api.toprak.xyz"],
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json())
app.set("trust proxy", 1)

applySecurityMiddlewares(app)
applyLoggingMiddleware(app)
app.use(checkVPN)
app.use(CheckUserAgent)
// Seucre

app.use('/api/post', PostRoutes)
app.use('/api/contact', ContactRoutes)
// app.use('/uploads', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://toprak.xyz');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// }, express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', SecureRoutes)
app.use('/api/subs', SubsRoutes)

app.get('/', (req, res) => {
  res.send('API Is working!!');
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`)
}) 