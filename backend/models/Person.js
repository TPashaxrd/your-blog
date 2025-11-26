const mongoose = require("mongoose")

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    IDs: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    interested: {
        type: String,
        required: false
    },
    links: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("PersonsIRL", PersonSchema)