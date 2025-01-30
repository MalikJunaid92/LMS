import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utilis/redis";
import { IUser } from "../models/user.model";
// authenticate user or protected routes
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const decode = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decode || !decode.id) {
      return next(new ErrorHandler("Invalid access token", 401));
    }

    const user = await redis.get(decode.id);
    if (!user) {
      return next(new ErrorHandler("Please login to access this resource.", 404));
    }

    req.user = JSON.parse(user)as IUser; // Attach user to req
    next();
  }
);
// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
