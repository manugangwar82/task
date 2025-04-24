const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification"); // ✅ Added for notifications
const router = express.Router();
// ✅ Add at the top
const bcrypt = require("bcryptjs");

// 📌 GET User Dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password").populate("tasks.taskId"); // ✅ Populate Task Details;
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            wallet: user.wallet,
            totalEarning: user.totalEarning,  // ✅ Ensure this is being sent
            investmentWallet: user.investmentWallet,
            referralCode: user.referralCode,
            tasksCompletedToday: user.tasksCompletedToday,
            lastTaskReset: user.lastTaskReset,
            vipLevel: user.vipLevel,  // ✅ Ensure this is included
            nextVipTarget: user.nextVipTarget,  // ✅ Ensure this is included
            tasks: user.tasks, // ✅ Tasks ko response me include kar diya
            vipRewardClaimed: user.vipRewardClaimed, // ✅ Add this
            popupDismissed: user.popupDismissed // ✅ Ye line add karo

        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// 📌 Complete Daily Task API
router.post("/complete-task", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Daily Task Reset Check
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const lastReset = new Date(user.lastTaskReset).toISOString().split("T")[0];

        if (today !== lastReset) {
            user.tasksCompletedToday = 0; // Reset daily tasks
            user.lastTaskReset = new Date();
        }

        // Check if user already completed max tasks
        if (user.tasksCompletedToday >= 5) {
            return res.status(400).json({ message: "Daily task limit reached!" });
        }

        // Task Complete → Wallet me 10 Coins Adda
        user.tasksCompletedToday += 1;
        user.wallet += 10; // Dynamic amount bhi implement kar sakte hain
        await user.save();

        res.json({ message: "Task completed!", wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// ✅ Leaderboard API
router.get("/leaderboard", async (req, res) => {
    try {
        // Top 10 users based on totalEarning (descending order)
        const topUsers = await User.find()
            .sort({ totalEarning: -1 }) // High to Low sorting
            .limit(10)
            .select("username totalEarning");

        res.json(topUsers);
    } catch (error) {
        console.error("❌ Leaderboard Fetch Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// 📌 Claim VIP Level Reward
router.post("/claim-reward", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const currentVipLevel = user.vipLevel;

        // ✅ Already claimed check
        if (user.vipRewardClaimed.includes(currentVipLevel)) {
            return res.status(400).json({ message: "Reward already claimed for this VIP level" });
        }

        // ✅ Claim Reward → Add $5
        user.wallet += 5;
        user.totalEarning += 5;
        user.rewardWallet += 5;

        // ✅ Mark this level as claimed
        user.vipRewardClaimed.push(currentVipLevel);

        await user.save();

        res.json({ message: "🎉 $5 reward claimed successfully!" });
    } catch (err) {
        console.error("Reward Claim Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// 📌 Dismiss Popup (announcement) permanently
router.put("/dismiss-popup", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log("iddddd", req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.popupDismissed = true;
        await user.save();

        res.json({ success: true, message: "Popup dismissed successfully!" });
    } catch (error) {
        console.error("Popup Dismiss Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 📌 Reset Popup Dismissed on logout
router.put("/reset-popup", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.popupDismissed = false; // ✅ Reset
        await user.save();

        res.json({ success: true, message: "Popup reset successfully" });
    } catch (error) {
        console.error("Reset Popup Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// 📢 ✅ Notifications System

// 🔹 Get All Notifications of User
router.get("/notifications", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ forUser: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error("Fetch Notifications Error:", err);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
});

// 🔹 Mark One Notification as Read
router.patch("/notifications/:id/read", authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            forUser: req.user.id
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();
        res.json({ message: "Notification marked as read" });
    } catch (err) {
        console.error("Mark Read Error:", err);
        res.status(500).json({ message: "Failed to mark as read" });
    }
});

// 🔹 Mark All Notifications as Read
router.patch("/notifications/mark-all-read", authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany({ forUser: req.user.id, isRead: false }, { isRead: true });
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error("Mark All Read Error:", err);
        res.status(500).json({ message: "Failed to mark all as read" });
    }
});

// 🔹 Delete Notification
router.delete("/notifications/:id", authMiddleware, async (req, res) => {
    try {
        await Notification.deleteOne({ _id: req.params.id, forUser: req.user.id });
        res.json({ message: "Notification deleted" });
    } catch (err) {
        console.error("Delete Notification Error:", err);
        res.status(500).json({ message: "Failed to delete notification" });
    }
});
// ✅ Add this inside your router
router.put("/reset-password", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id; // from authenticateUser middleware
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ message: "Server error during password reset" });
    }
});

module.exports = router;