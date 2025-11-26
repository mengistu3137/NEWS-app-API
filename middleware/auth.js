import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/constants.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
