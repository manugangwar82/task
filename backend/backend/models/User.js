const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 0 }, // Wallet balance
  totalEarning: { type: Number, default: 0 }, // Total earning balance
  rewardWallet: { type: Number, default: 0 }, // 🎁 VIP rewards ke liye
  investmentWallet: {  type: Number, default: 0},
  isBanned: { type: Boolean,default: false},
  popupDismissed: { type: Boolean, default: false },
  vipLevel: { type: Number, default: 1},  // ✅ Default Level 1
  nextVipTarget: { type: Number, default: 100 }, // ✅ Next Level Target (e.g. 100 coins)
  vipRewardClaimed: { type: [Number], default: [] }, // ✅ Already claimed VIP levels
  // canClaimVipReward: { type: Boolean, default: false }, // ✅ Allow reward claiming if true
  referralCode: { type: String, unique: true }, // Unique referral code
  referredBy: { type: String, default: null }, // ✅ इसे ObjectId से String कर दो
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 🆕 Referred Users List
  referralWallet: { type: Number, default: 0 }, // 🆕 Referral Wallet
  referralRewardGivenTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tasksCompletedToday: { type: Number, default: 0 }, // Aaj ke completed tasks
  lastTaskReset: { type: Date, default: Date.now }, // Last reset date

  // ✅ New Field for Purchased Tasks
  tasks: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // Task ka reference
      lastCollected: { type: Date, default: null }, // Last profit collect ka time
      progress: { type: Number, default: 0 },  // ✅ Task progress track
      totalDuration: { type: Number, required: true, default: 0 }  // ✅ Fix applied
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
