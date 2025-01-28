import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utilis/redis";
import mongoose from "mongoose";

// upload course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      await createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edt course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// get single course --> without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCahceExist = await redis.get(courseId);

      if (isCahceExist) {
        const course = JSON.parse(isCahceExist);
        return res.status(201).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions"
        );
        await redis.set(courseId, JSON.stringify(course));
        res.status(201).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// get all courses --> without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses"); // Check Redis cache
      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        return res.status(200).json({
          success: true,
          courses,
        });
      } else {
        // Fetch from MongoDB if not in cache
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestions -courseData.links -courseData.questions"
        );

        // Update Redis cache with the newly fetched courses
        await redis.set("allCourses", JSON.stringify(courses));

        return res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// get course content --> only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExist = courseList?.find(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExist) {
        return next(
          new ErrorHandler(
            "You are not eligible to access this resources!",
            403
          )
        );
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      return res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// add question in the course

interface IQuestion {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IQuestion;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }
      const courseContent = course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content Id", 404));
      }
      // create a new questions object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      //   add the question to the course content
      if (courseContent.questions) {
        courseContent.questions.push(newQuestion);
      } else {
        courseContent.questions = [newQuestion];
      }
      await course?.save();
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
