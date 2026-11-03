const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = { username: payload.username, role: payload.role };
    return next();
  } catch (error) {
    if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") {
      return next(error);
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again",
    });
  }
}

module.exports = authenticateToken;
