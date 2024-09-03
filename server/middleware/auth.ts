require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
// Import your user model
import User from "../models/user.model"; 
// Middleware to check if the user is authenticated
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract access token from cookies
      const access_token = req.cookies.access_token as string;

      if (!access_token) {
        return next(
          new ErrorHandler("Please log in to access this resource", 400)
        );
      }

      let decoded: JwtPayload;
      try {
        // Verify the access token
        decoded = jwt.verify(
          access_token,
          process.env.ACCESS_TOKEN as string
        ) as JwtPayload;
      } catch (error) {
        return next(new ErrorHandler("Access token is not valid", 400));
      }

      // Extract user ID from the decoded token
      const userId = decoded.id;
      
      if (!userId) {
        return next(new ErrorHandler("Invalid token payload", 400));
      }

      // Query the database for the user
      const user = await User.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Attach the user to the request object
      req.user = user;
      next();
    } catch (error) {
      return next(new ErrorHandler("Authentication failed", 500));
    }
  }
);
