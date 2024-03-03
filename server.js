import app from "./backend/app.js";
import connectDB from "./backend/config/database.js";
import { NODE_ENV, PORT } from "./backend/config/index.js";
import dotenv from "dotenv";

if (NODE_ENV !== "production") {
  dotenv.config();
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
