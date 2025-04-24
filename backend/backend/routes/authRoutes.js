const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// 📌 User Signup API (Referral System ke saath)
router.post("/signup", async (req, res) => {
  const { username, email, password, referralCode } = req.body;

  try {
    // 🔹 Password Length Validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // 🔹 Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // 🔹 Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      referralCode: Math.random().toString(36).substring(2, 8), // Generate unique referral code
      referralWallet: 0, // 🆕 Referral wallet add kiya
      totalEarning: 0,
      wallet: 0,
      referredUsers: [],
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUser.referredBy = referrer._id;
        referrer.referredUsers.push(newUser._id);
        await referrer.save();
      }
    }

    await newUser.save();
    res.json({ message: "Signup successful" });
  } catch (error) {
    console.error("❌ Signup Error:", error); // ✅ Error को log करो
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ User Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Empty field validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter both email and password" });
    }

    // 🔹 Basic email format check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // 🔹 Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email" });
    }

    // 🔹 Password Check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again" });
    }

    // JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5d" });

    res.json({ token, user });

  } catch (error) {

    res.status(500).json({ message: "Server Error" });
  }
});
// ✅ Get Referral Data API
router.get("/referral-data", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("referredUsers", "username email createdAt wallet");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // 🔥 Calculate total wallet sum of all referred users
    const totalTeamWallet = user.referredUsers.reduce((sum, u) => {
      const walletValue = Number(u.wallet) || 0; // ensure it's numeric
      return sum + walletValue;
    }, 0);
    res.json({
      referralWallet: user.referralWallet,
      totalEarning: user.totalEarning,
      referredUsers: user.referredUsers,
      wallet: user.wallet,
      totalTeamWallet, // ✅ added in response
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;



