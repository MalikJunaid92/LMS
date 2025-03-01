import { app } from "./app";
import { initSocketServer } from "./socketServer";
import { connectDB } from "./utilis/db";
import cloudinary from "cloudinary";
import http from "http";
require("dotenv").config();
// cloudinary config
const server = http.createServer(app);
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
initSocketServer(server);


server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});
