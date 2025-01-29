// get user by id

import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utilis/redis";

export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};
// get all users
export const getAllUsers = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 }); 
  res.status(200).json({
    success: true,
    users,
  });
};