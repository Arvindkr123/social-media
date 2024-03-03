import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  avtar: {
    public_id: String,
    url: String,
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  follwers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  follwing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(
        this.password,
        await bcrypt.genSalt(10)
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (password) {
  try {
    // console.log("Entered Password:", password);
    // console.log("Stored Hashed Password:", this.password);

    const isMatch = await bcrypt.compare(password, this.password);
    // console.log("Password Comparison Result:", isMatch);

    return isMatch;
  } catch (error) {
    console.error("Error in matchPassword:", error.message);
    return false;
  }
};

userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, JWT_SECRET, { expiresIn: "90d" });
};

export const userModel = mongoose.model("User", userSchema);
