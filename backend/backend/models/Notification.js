const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: { type: String, enum: ["info", "warning", "success", "danger"], default: "info" },
  forUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null means for all
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
