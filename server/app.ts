import express from "express";
export const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.route";
// body-parser
app.use(express.json({ limit: "50mb" }));

// cookie-parser
app.use(cookieParser());

// cors => Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/", courseRouter);

// error middleware
app.use(ErrorMiddleware);
