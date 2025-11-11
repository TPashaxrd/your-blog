const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const PostRoutes = require("./routes/PostRoutes")
const path = require("path")
const ContactRoutes = require("./routes/ContactRoutes")
const SecureRoutes = require("./routes/secure")
const SubsRoutes = require("./routes/subs")
const { applySecurityMiddlewares, applyLoggingMiddleware, setupRequestLogger } = require("./middlewares/SecurityChain")
const checkVPN = require("./middlewares/checkVPN")
const app = express()

db()

app.use(cors({
    origin: ["https://toprak.xyz", "https://api.toprak.xyz"],
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"]
}))

app.use(express.json())
app.set("trust proxy", 1)

applySecurityMiddlewares(app)
applyLoggingMiddleware(app)
app.use(checkVPN)

app.use('/api/post', PostRoutes)
app.use('/api/contact', ContactRoutes)
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