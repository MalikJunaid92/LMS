require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "none" | "lax" | "strict";
  secure?: boolean;
}

  // Parse environment variables with fallback values
  export const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE || "300",
    10
  );
  export const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || "1200",
    10
  );

  // Options for cookies
 export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 30 * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

export const sendToken = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.singRefreshToken();

  // Upload session to Redis
    const typedUser = user as IUser;
    redis.set((typedUser._id as string).toString(), JSON.stringify(typedUser));

  // Only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  // Set cookies
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Send response
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};