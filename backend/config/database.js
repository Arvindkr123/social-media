import mongoose from "mongoose";
import { MONGO_URI } from "./index.js";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(MONGO_URI);
    console.log("Database connection established", res.connection.host);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
