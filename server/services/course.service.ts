import { CatchAsyncError } from "../middleware/catchAsyncError";
import CourseModel from "../models/course.model";
import { Response } from "express";

export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const { benefits, prerequisite, courseData, ...rest } = data;

    const course = await CourseModel.create({
      ...rest,
      benefits: benefits || [],
      prerequisite: prerequisite || [],
      courseData: courseData || [],
    });

    res.status(201).json({
      success: true,
      course,
    });
  }
);
// get all courses
export const getAllCourseService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 }); 
  res.status(200).json({
    success: true,
    courses,
  });
};