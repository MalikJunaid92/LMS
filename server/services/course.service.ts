import { Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import CourseModel from "../models/course.models";


// create course

export const createCourse = catchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);
