const mongoose = require("mongoose")

const SubscribeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    IP_Address: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Subscribes", SubscribeSchema)