const mongoose = require("mongoose")

const NoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: false
    },
    readOnce: {
        type: Boolean,
        default: true
    },
    hasRead: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

NoteSchema.index({ expiresAt: '1' }, {expireAfterSeconds: 0})

module.exports = mongoose.model('Note', NoteSchema)