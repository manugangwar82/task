// routes/referral.js
const express = require("express");
const router = express.Router();
const ReferralSettings = require("../models/ReferralSettings");

router.get("/settings", async (req, res) => {
  try {
    const settings = await ReferralSettings.findOne(); // only one document expected
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch referral settings" });
  }
});

module.exports = router;
