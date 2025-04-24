const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received Username:", username);  // Check received username
  console.log("Received Password:", password);  // Check received password

  // console.log("Env Username:", process.env.ADMIN_USERNAME);
  if (username !== process.env.ADMIN_USERNAME) {
    console.log("Env Username:", process.env.ADMIN_USERNAME);
    return res.status(401).json({ message: "Invalid username" });
    
  }

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  console.log("Password Match:", isMatch);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ isAdmin: true }, process.env.ADMIN_JWT_SECRET, { expiresIn: "6d" });

  res.json({ message: "Login successful", token });
});

module.exports = router;
