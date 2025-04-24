
// adminRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const ReferralSettings = require("../models/ReferralSettings")
const WithdrawalRequest = require("../models/withdrawRequest");
const DepositRequest = require("../models/depositRequest");
const Notification = require("../models/Notification");
const { getReferralTree } = require("../controllers/adminController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// ✅ Get All Users
router.get("/users", adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Update user info
router.put("/user/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const { wallet, vipLevel, isBanned } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (wallet !== undefined) user.wallet = wallet;
    if (vipLevel !== undefined) user.vipLevel = vipLevel;
    if (isBanned !== undefined) user.isBanned = isBanned;

    await user.save();
    res.json({ message: "User updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// ✅ Delete user
router.delete("/user/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ✅ Reset password
router.post("/user/:id/reset-password", adminAuthMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ message: "Password reset successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset password ❌" });
  }
});

// ✅ Referral Tree
router.get("/user/:id/referral-tree", adminAuthMiddleware, getReferralTree);

// ✅ Withdrawals
router.get("/withdrawals", adminAuthMiddleware, async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find();
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch withdrawal requests" });
  }
});

router.post("/withdrawals/:id/approve", adminAuthMiddleware, async (req, res) => {
  try {
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    if (!withdrawal || withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Invalid withdrawal request" });
    }
    withdrawal.status = "approved";
    await withdrawal.save();

    const user = await User.findById(withdrawal.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wallet -= withdrawal.amount;
    await user.save();
    res.json({ message: "Withdrawal approved successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve withdrawal ❌" });
  }
});

router.post("/withdrawals/:id/reject", adminAuthMiddleware, async (req, res) => {
  try {
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    if (!withdrawal || withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Invalid withdrawal request" });
    }
    withdrawal.status = "rejected";
    await withdrawal.save();
    res.json({ message: "Withdrawal rejected successfully ❌" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject withdrawal ❌" });
  }
});

// ✅ Deposits
router.get("/deposits", adminAuthMiddleware, async (req, res) => {
  try {
    const deposits = await DepositRequest.find();
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deposit requests" });
  }
});


router.post("/deposits/:id/approve", adminAuthMiddleware, async (req, res) => {
  try {
    const deposit = await DepositRequest.findById(req.params.id);
    if (!deposit || deposit.status !== "pending") {
      return res.status(400).json({ message: "Invalid deposit request" });
    }

    deposit.status = "approved";
    await deposit.save();

    const user = await User.findById(deposit.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wallet += deposit.amount;
    await user.save();

    // ✅ Referral Reward Logic (based on % of deposit amount)
    const settings = await ReferralSettings.findOne();
    const referralRewardPercent = settings?.referralRewardPercent || 5; // Default 5%

    if (user.referredBy && deposit.amount > 0) {
      const referrer = await User.findById(user.referredBy);

      const alreadyRewarded = referrer.referralRewardGivenTo.includes(user._id);

      if (!alreadyRewarded) {
        const referralBonus = (deposit.amount * referralRewardPercent) / 100;

        referrer.wallet += referralBonus;
        referrer.totalEarning += referralBonus;
        referrer.referralWallet += referralBonus;
        referrer.referralRewardGivenTo.push(user._id); // Mark as rewarded

        await referrer.save();

        console.log(`✅ ${referrer.username} got $${referralBonus} for referring ${user.username}`);
      }
    }

    res.json({ message: "Deposit approved successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve deposit ❌" });
  }
});


router.post("/deposits/:id/reject", adminAuthMiddleware, async (req, res) => {
  try {
    const deposit = await DepositRequest.findById(req.params.id);
    if (!deposit || deposit.status !== "pending") {
      return res.status(400).json({ message: "Invalid deposit request" });
    }
    deposit.status = "rejected";
    await deposit.save();
    res.json({ message: "Deposit rejected successfully ❌" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject deposit ❌" });
  }
});

// ✅ Tasks
router.get("/tasks", adminAuthMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/tasks", adminAuthMiddleware, async (req, res) => {
  try {
    const { name, price, dailyProfit, duration, totalProfit, isActive } = req.body;
    const newTask = new Task({ name, price, dailyProfit, duration, totalProfit, isActive });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/tasks/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const { name, price, dailyProfit, duration, totalProfit, isActive } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { name, price, dailyProfit, duration, totalProfit, isActive },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/tasks/:id", adminAuthMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/tasks/:id/toggle", adminAuthMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.isActive = !task.isActive;
    await task.save();
    res.json({ message: `Task is now ${task.isActive ? "active" : "inactive"}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Referral Monitoring Features
router.get("/top-referrers", adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("referralWallet username email");
    const sorted = users.filter(u => u.referralWallet > 0).sort((a, b) => b.referralWallet - a.referralWallet).slice(0, 10);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top referrers" });
  }
});

router.get("/referral-chart", adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("username referralWallet");
    const chartData = users.filter(u => u.referralWallet > 0).map(user => ({
      label: user.username,
      value: user.referralWallet
    })).slice(0, 8);
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate chart data" });
  }
});

router.get("/referral-settings", adminAuthMiddleware, async (req, res) => {
  try {
    let config = await ReferralSettings.findOne();
    if (!config) config = await ReferralSettings.create({ referralRewardPercent });``
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Failed to get referral settings" });
  }
});


router.put("/referral-settings", adminAuthMiddleware, async (req, res) => {
  try {
    const { referralRewardPercent } = req.body;

    let config = await ReferralSettings.findOne();
    if (!config) {
      config = await ReferralSettings.create({ referralRewardPercent });
    } else {
      config.referralRewardPercent = referralRewardPercent;
      await config.save();

    }

    res.json({ message: "Referral settings updated ✅", referralRewardPercent });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update referral settings ❌" });
  }
});




// 🔔 Get notifications for a user
router.get("/notifications/:userId", adminAuthMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications ❌" });
  }
});

// ✅ Mark notification as read
router.put("/notifications/:notificationId/read", adminAuthMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.isRead = true;
    await notification.save();
    res.json({ message: "Notification marked as read ✅" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification ❌" });
  }
});

// ✅ Send notification to a specific user or all users
router.post("/notifications/send", adminAuthMiddleware, async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    if (userId === "all") {
      // If "all" is selected, send notification to all users
      const users = await User.find(); // Fetch all users
      const notifications = users.map(user => ({
        forUser: user._id,
        title,
        message,
        isRead: false
      }));
      
      await Notification.insertMany(notifications); // Insert all notifications at once
      return res.json({ message: "Notification sent to all users ✅" });
    }

    // Send notification to specific user
    const notification = new Notification({
      forUser: userId,
      title,
      message,
      isRead: false
    });

    await notification.save();
    res.json({ message: "Notification sent to user ✅" });

  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Failed to send notification ❌" });
  }
});


// ✅ Delete all notifications for all users
router.delete("/notifications/delete-all", adminAuthMiddleware, async (req, res) => {
  try {
    const result = await Notification.deleteMany({});
    res.json({ message: "All notifications deleted for all users ✅", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Delete All Error:", err);
    res.status(500).json({ message: "Failed to delete all notifications ❌" });
  }
});

// ✅ Delete all notifications for a specific user
router.delete("/notifications/user/:userId", adminAuthMiddleware, async (req, res) => {
  try {
    const result = await Notification.deleteMany({ forUser: req.params.userId });
    res.json({ message: `All notifications for user deleted ✅`, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notifications ❌" });
  }
});



module.exports = router;
