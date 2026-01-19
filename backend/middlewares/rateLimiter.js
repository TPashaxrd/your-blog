const rateLimiter = require("express-rate-limit")
require("dotenv").config()

const allowedIPs = [process.env.IP]

const authLimiter = rateLimiter({
   windowMs: 15 * 60 * 1000,
   max: 15,
   standartHeaders: true,
   legacyHeaders: false,
   message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  },
  skip: (req, res) => allowedIPs.includes(req.ip)
})

const contactLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many contact attempts. Please try again later."
    },
    skip: (req, res) => allowedIPs.includes(req.ip)
})

const generalLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per 15 minutes
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
      skip: (req, res) => allowedIPs.includes(req.ip)
})

const noteLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again later."
    },
      skip: (req, res) => allowedIPs.includes(req.ip)
})

const subscribeLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many subscribe attempts. Please try again later."
    },
      skip: (req, res) => allowedIPs.includes(req.ip)
})

const adminLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many admin requests. Please try again later."
    },
      skip: (req, res) => allowedIPs.includes(req.ip)
})

const commentLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 requests per 15 minutes
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many comment attempts. Please try again later."
    },
      skip: (req, res) => allowedIPs.includes(req.ip)
})

module.exports = {
    authLimiter,
    contactLimiter,
    subscribeLimiter,
    noteLimiter,
    generalLimiter,
    adminLimiter,
    commentLimiter
}