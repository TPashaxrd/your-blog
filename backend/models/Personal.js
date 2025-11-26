const mongoose = require("mongoose")

const PersonalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    links: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Personal", PersonalSchema)