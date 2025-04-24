// routes/depositRoutes.js
const express = require('express');
const router = express.Router();
const User = require("../models/User");
const DepositRequest = require('../models/depositRequest');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/create', authMiddleware, async (req, res) => {
  // console.log("💥 req.body:", req.body); // 🕵️ Check incoming data
  try {
    const { username,method, amount, txnId } = req.body;
    // console.log("Received fields:", username, method, amount);
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

     // ✅ Check username match
     if (user.username !== username) {
      return res.status(400).json({ message: 'Username does not match logged-in user' });
    }
  
    const newRequest = new DepositRequest({
      user: userId,
      contact: username,
      method,
      amount,
      txnId
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: 'Deposit request submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
});

module.exports = router;
