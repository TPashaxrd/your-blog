const rateLimiter = require("express-rate-limit")

const authLimiter = rateLimiter({
   windowMs: 15 * 60 * 1000,
   max: 15,
   standartHeaders: true,
   legacyHeaders: false,
   message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  }
})

const contactLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many contact attempts. Please try again later."
    }
})

const noteLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again later."
    }
})

const subscribeLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standartHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many subscribe attempts. Please try again later."
    }
})

module.exports = {
    authLimiter,
    contactLimiter,
    subscribeLimiter,
    noteLimiter
}