const express = require("express");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
};

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const user = { username, role: "admin" };
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "8h",
    });

    res.cookie("access_token", token, authCookieOptions);
    return res.json({
      success: true,
      message: "Login successful",
      user,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
});


router.get("/session", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});


router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;