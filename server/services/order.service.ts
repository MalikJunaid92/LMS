import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import OrderModel from "../models/order.model";
import ErrorHandler from "../utilis/ErrorHandler";

// create new order
export const newOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    try {
      const order = await OrderModel.create(data);
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// get all orders
export const getAllOrderService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    orders,
  });
};
