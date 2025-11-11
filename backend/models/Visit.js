const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    ip: String,
    userAgent: String,
    paths: { type: [String], default: [] },
    count: { type: Number, default: 0 },
    lastVisited: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visit", visitSchema);