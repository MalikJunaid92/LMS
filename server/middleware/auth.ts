require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";
// import { redisClient } from "../utilis/redis";
//  is authenticated
export const isAuthenticated = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const access_token = req.cookies.access_token as string;
      if (!access_token) {
        return next(
          new ErrorHandler("Please log in to access this resource", 400)
        );
      }
  
      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          access_token,
          process.env.ACCESS_TOKEN as string
        ) as JwtPayload;
      } catch (error) {
        return next(new ErrorHandler("Access token is not valid", 400));
      }
  
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      req.user = user;
      next();
    }
  );
// validate user role

export const authorizeRoles=(...roles:string[])=>{
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
}