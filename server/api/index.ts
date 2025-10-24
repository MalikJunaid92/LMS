import express, { Request, Response } from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

import { connectDB } from "../utilis/db";
import { ErrorMiddleware } from "../middleware/error";
import userRouter from "../routes/user.routes";
import courseRouter from "../routes/course.route";
import orderRouter from "../routes/order.routes";
import notificationRouter from "../routes/notification.route";
import analyticsRouter from "../routes/analytics.route";
import layoutRouter from "../routes/layout.route";

dotenv.config();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// ✅ Allow frontend origin
app.use(
  cors({
    origin: ["http://localhost:3000", "https://lms-six-gilt.vercel.app"],
    credentials: true,
  })
);

// Connect DB
connectDB();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Backend running successfully on Vercel!");
});

app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// Global error handler
app.use(ErrorMiddleware);

// ✅ Export only serverless function (no server.listen)
export const handler = serverless(app);
export default app;
