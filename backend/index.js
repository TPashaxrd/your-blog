const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const PostRoutes = require("./routes/PostRoutes")
const path = require("path")
const ContactRoutes = require("./routes/ContactRoutes")
const { limiter } = require("./middleware/rateLimit")
const SecureRoutes = require("./routes/secure")
const SubsRoutes = require("./routes/subs")
const app = express()

db()

app.use(cors())
app.use(express.json())
app.use('/api/post', limiter, PostRoutes)
app.use('/api/contact', limiter, ContactRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', SecureRoutes)
app.use('/api/subs', SubsRoutes)
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`)
}) 