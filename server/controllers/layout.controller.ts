import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utilis/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// Create Layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });

      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 400));
      }

      if (type === "Banner") {
        const { image, title, subtitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "banner",
        });

        await LayoutModel.create({
          type: "Banner",
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));

        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }

      if (type === "Category") {
        const { categories } = req.body;
        const categoryItems = categories.map((item: any) => ({
          title: item.title,
        }));

        await LayoutModel.create({
          type: "Category", // FIXED: Previously was "Categories"
          categories: categoryItems,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit Layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const { image, title, subtitle } = req.body;

        const bannerData = await LayoutModel.findOne({ type: "Banner" }) as any;
        let updatedImage = {};

        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(image, {
            folder: "banner",
          });

          updatedImage = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }

        await LayoutModel.findOneAndUpdate(
          { type: "Banner" },
          { $set: { image: updatedImage, title, subtitle } },
          { upsert: true, new: true }
        );
      }

      if (type === "FAQ") {
        const { faq } = req.body;

        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));

        await LayoutModel.findOneAndUpdate(
          { type: "FAQ" },
          { $set: { faq: faqItems } },
          { upsert: true, new: true }
        );
      }

      if (type === "Category") {
        const { categories } = req.body;

        const categoryItems = categories.map((item: any) => ({
          title: item.title,
        }));

        await LayoutModel.findOneAndUpdate(
          { type: "Category" }, // FIXED: Previously was "Categories"
          { $set: { categories: categoryItems } },
          { upsert: true, new: true }
        );
      }

      return res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layout by type
export const getLayoutByType = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { type } = req.body;
        const layout = await LayoutModel.findOne({ type });
        if (!layout) {
          return next(new ErrorHandler(`Layout ${type} not found`, 400));
        }
  
        res.status(200).json({
          success: true,
          layout,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );