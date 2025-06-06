const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes"); // ✅ Task Route Import Karo
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes")
const withdrawRoutes = require("./routes/withdrawRoutes")
const depositRoutes = require("./routes/depositRoutes")
const transactionRoutes = require('./routes/transactionRoutes'); // ✅ Add this
const adminAuth = require('./routes/adminAuth'); // ✅ Add this
const referral = require('./routes/referralRoutes')

dotenv.config();
// require("dotenv").config();
console.log(process.env.MONGO_URI); // Check .env value
console.log("JWT_SECRET",process.env.JWT_SECRET);
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
origin: ["https://earnwithcampa.site", "https://admin-d35r.onrender.com"], // ✅ Array of allowed domains
  credentials: true, // ✅ Important for cookies / Authorization header
};

app.use(cors(corsOptions));

app.use("/api", taskRoutes); // ✅ Routes Use Karo
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/transactions', transactionRoutes); // ✅ Add this line
app.use('/api/adminAuth', adminAuth); // ✅ Add this line
app.use("/api/referral",referral);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}✅`));
