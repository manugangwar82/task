
// // routes/withdrawRoutes.js
// const express = require("express");
// const User = require("../models/User");
// const WithdrawRequest = require("../models/WithdrawRequest");
// const authMiddleware = require("../middleware/authMiddleware");
// const router = express.Router();

// router.post("/request", authMiddleware, async (req, res) => {
//   try {
//     const { contact, address, method, amount } = req.body;
//     const userId = req.user.id;

//     if (!contact || !address || !method || !amount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const user = await User.findById(userId);
//     if (!user || user.wallet < amount) {
//       return res.status(400).json({ message: "Insufficient wallet balance" });
//     }

//     // Step 1: Subtract wallet
//     user.wallet -= amount;
//     user.totalEarning -= amount;
//     await user.save();

//     // Step 2: Create withdraw request
//     const newRequest = new WithdrawRequest({
//       user: userId,
//       contact,
//       address,
//       method,
//       amount,
//     });

//     await newRequest.save();
//     res.json({ message: "Withdraw request submitted successfully" });
//   } catch (err) {
//     console.error("Withdraw request error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Yeh line zaroori hai!
// module.exports = router;








const express = require("express");
const bcrypt = require("bcryptjs"); // For password comparison
const User = require("../models/User");
const WithdrawRequest = require("../models/withdrawRequest");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/request", authMiddleware, async (req, res) => {
  console.log("💥 req.body:", req.body); // 🕵️ Check incoming data
  try {
    const { username, password, address, method, amount } = req.body;
    console.log("Received fields:", username, address, method, amount, password);

    const userId = req.user.id;

    if (!username || !password || !address || !method || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Username match check
    if (user.username !== username) {
      return res.status(400).json({ message: "Invalid username" });
    }

    // ✅ Password match check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Wallet balance check
    if (user.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 📝 Create withdraw request
    const newRequest = new WithdrawRequest({
      user: userId,
      contact: username,
      address,
      method,
      amount,
    });

    await newRequest.save();
    res.json({ message: "Withdraw request submitted successfully" });

  } catch (err) {
    console.error("Withdraw request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
