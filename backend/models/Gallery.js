const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            user: { type: String, required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gallery", GallerySchema);