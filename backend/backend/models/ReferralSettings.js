// models/ReferralSettings.js
const mongoose = require("mongoose");

const referralSettingsSchema = new mongoose.Schema({
 
  referralRewardPercent: {
    type: Number,
    default: 5, // ✅ Default 5%
  }
});

module.exports = mongoose.model("ReferralSettings", referralSettingsSchema);
