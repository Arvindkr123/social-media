import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
import { userModel } from "../models/user.models.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Please login first" });
    }

    const decoded = await jwt.verify(token, JWT_SECRET);
    req.user = await userModel.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
