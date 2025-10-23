import express, { Request, Response } from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import cors from "cors";

import { ErrorMiddleware } from "../middleware/error";
import userRouter from "../routes/user.routes";
import courseRouter from "../routes/course.route";
import orderRouter from "../routes/order.routes";
import notificationRouter from "../routes/notification.route";
import analyticsRouter from "../routes/analytics.route";
import layoutRouter from "../routes/layout.route";

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// ✅ IMPORTANT: Allow your frontend origin
app.use(
  cors({
    origin: ["http://localhost:3000", "https://lms-six-gilt.vercel.app/"],
    credentials: true,
  })
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Backend running successfully on Vercel!");
});

app.use("/api/v1", userRouter);
app.use(
  "/api/v1",
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// Global error handler
app.use(ErrorMiddleware);

// ✅ Export for Vercel (serverless)
export { app };
export const handler = serverless(app);
