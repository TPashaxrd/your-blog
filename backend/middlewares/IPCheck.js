const axios = require("axios")

const allowedIP = process.env.IP;

const checkIPMiddleware = async(req, res, next) => {
    try {
        const response = await axios.get("https://api.ipify.org?format=json")
        const clientIP = response.data.ip
        console.log("Public IP: ", clientIP)

        if(clientIP !== allowedIP) {
            return res.status(403).json({ message: "Access Denied: IP Not Allowed"})
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "IP didn't matches."})
    }
}

module.exports = checkIPMiddleware