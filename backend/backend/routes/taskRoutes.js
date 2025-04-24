const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Function: Check & Upgrade VIP Level
const checkVipLevel = (user) => {
  const vipLevels = [
    { level: 1, target: 100 },
    { level: 2, target: 200 },
    { level: 3, target: 400 },
    { level: 4, target: 600 },
    { level: 5, target: 800 }
  ];

  for (let i = vipLevels.length - 1; i >= 0; i--) {
    if (user.totalEarning >= vipLevels[i].target) {
      user.vipLevel = vipLevels[i].level;
      user.nextVipTarget = vipLevels[i + 1] ? vipLevels[i + 1].target : null;
      break;
    }
  }
};

// ✅ Get All Tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().lean();
    res.json(tasks);
  } catch (error) {
    console.error("❌ Get Tasks Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Buy Task
router.post("/buy-task", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Buy Task API Called!");
    const { taskId } = req.body;
    const userId = req.user.id;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({ message: "Task/User not found" });
    }

    if (user.wallet < task.price) {
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    // ✅ Check if user already owns the task
    const alreadyBought = user.tasks.some((t) => t.taskId.toString() === taskId);
    if (alreadyBought) {
      return res.status(400).json({ message: "You already own this task" });
    }

    // 💰 Deduct price & store task in user DB
    user.wallet -= task.price;
    user.investmentWallet += task.price; // ✅ Track investment here
    user.tasks.push({ taskId, lastCollected: null, progress: 0, totalDuration: task.duration });

    await user.save();

    // ✅ Fetch updated user data
    const updatedUser = await User.findById(userId).populate("tasks.taskId");

    console.log("✅ Task Purchased Successfully!");
    res.json({
      message: "Task Purchased Successfully",
      wallet: updatedUser.wallet,
      investmentWallet: updatedUser.investmentWallet, // ✅ Return this also
      tasks: updatedUser.tasks.map((t) => ({
        _id: t.taskId._id,
        name: t.taskId.name,
        price: t.taskId.price,
        dailyProfit: t.taskId.dailyProfit,
        duration: t.taskId.duration,
        totalDuration: t.totalDuration, // ✅ Send correct totalDuration
        lastCollected: t.lastCollected,
      })),
    });
  } catch (error) {
    console.error("❌ Buy Task API Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Collect Daily Profit
router.post("/collect-profit", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Collect Profit API Called!");
    const { taskId } = req.body;
    const userId = req.user.id;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const user = await User.findById(userId).populate("tasks.taskId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const taskIndex = user.tasks.findIndex((t) => t.taskId._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(400).json({ message: "You have not purchased this task" });
    }

    const userTask = user.tasks[taskIndex];
    const now = new Date();
    const nextCollectTime = userTask.lastCollected
      ? new Date(userTask.lastCollected.getTime() + 24 * 60 * 60 * 1000)
      : now;

    if (userTask.lastCollected && now < nextCollectTime) {
      return res.status(400).json({
        message: `⏳ You can collect profit after ${Math.floor((nextCollectTime - now) / 60000)}m`
      });
    }

    // ✅ Add Daily Profit to Wallet
    user.wallet += userTask.taskId.dailyProfit;
    user.totalEarning += userTask.taskId.dailyProfit;  // Adding profit to totalEarning
    userTask.progress += 1;  // ✅ Progress increase karein
    userTask.lastCollected = now;

    // ✅ Check & Upgrade VIP Level
    checkVipLevel(user);

    // ✅ Check Task Completion
    if (userTask.progress >= userTask.totalDuration) {
      user.tasks.splice(taskIndex, 1);  // Task complete hone par remove kar do
      console.log("🎉 Task Completed & Removed!");
    }
    await user.save();


    console.log("✅ Profit Collected Successfully!");
    res.json({
      message: "Profit Collected Successfully",
      wallet: user.wallet,
      totalEarning: user.totalEarning,  // Sending totalEarning to frontend
      lastCollected: userTask.lastCollected,
      taskProgress: userTask.progress,
      vipLevel: user.vipLevel,
      nextVipTarget: user.nextVipTarget
    });
  } catch (error) {
    console.error("❌ Collect Profit API Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get User Tasks
router.get("/user-tasks", authMiddleware, async (req, res) => {
  try {
    console.log("🟢 API HIT: /user-tasks");

    const userId = req.user.id;
    const user = await User.findById(userId).populate("tasks.taskId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedTasks = user.tasks.map((t) => ({
      _id: t.taskId._id,
      name: t.taskId.name,
      price: t.taskId.price,
      totalProfit: t.taskId.totalProfit,
      dailyProfit: t.taskId.dailyProfit,
      duration: t.taskId.duration,
      lastCollected: t.lastCollected,
      nextCollectTime: t.lastCollected
        ? new Date(t.lastCollected.getTime() + 24 * 60 * 60 * 1000)
        : null,
    }));

    console.log("✅ Sending Tasks:", formattedTasks);
    console.log("✅ VIP Level:", user.vipLevel); // Debug log


    // res.json({ tasks: formattedTasks, wallet: user.wallet });
    res.json({
      tasks: formattedTasks,
      wallet: user.wallet,
      vipLevel: user.vipLevel,
      nextVipTarget: user.nextVipTarget
    });
  } catch (error) {
    console.error("❌ Get User Tasks Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
