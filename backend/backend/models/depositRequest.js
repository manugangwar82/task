const mongoose = require('mongoose');

const depositRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact: { type: String, required: true },
  method: { type: String, required: true },
  amount: { type: Number, required: true },
  txnId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DepositRequest', depositRequestSchema);
