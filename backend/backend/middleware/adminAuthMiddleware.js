const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    console.log("Decoded Token Data:", decoded);
    if (!decoded.isAdmin) throw new Error();
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = adminAuthMiddleware;
