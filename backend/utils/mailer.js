const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS
    }
})

module.exports = transporter