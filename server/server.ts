import { app } from "./app";
import { connectDB } from "./utilis/db";
import {v2 as cloudinary} from "cloudinary";
// import { redisClient } from "./utilis/redis";

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
})
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
  // redisClient;
});
