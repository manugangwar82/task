// In routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const DepositRequest = require('../models/depositRequest');
const WithdrawRequest = require('../models/withdrawRequest');

router.get('/history', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const deposits = await DepositRequest.find({ user: userId }).sort({ createdAt: -1 });
    const withdrawals = await WithdrawRequest.find({ user: userId }).sort({ createdAt: -1 });

    res.json({ deposits, withdrawals });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
