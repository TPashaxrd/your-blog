const mongoose = require("mongoose")

const VaultSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Vault", VaultSchema)