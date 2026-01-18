const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
  systemMode: { type: Boolean, default: true },
  lastUpdatedBy: { type: String, default: "admin" }
});

module.exports = mongoose.model("System", SystemSchema);