const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // image: { type: String, required: true },
  price: { type: Number, required: true },
  dailyProfit: { type: Number, required: true },
  duration: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Task", taskSchema);
