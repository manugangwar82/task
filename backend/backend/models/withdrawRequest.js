// models/WithdrawRequest.js
const mongoose = require("mongoose");

const withdrawRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  method: { type: String, required: true }, // BEP20 or TRC20
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending / approved / rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WithdrawRequest", withdrawRequestSchema);
