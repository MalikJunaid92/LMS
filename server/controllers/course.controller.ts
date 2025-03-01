import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import { createCourse, getAllCourseService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utilis/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import { sendMail } from "../utilis/sendMail";
import NotificationModel from "../models/notificationModel";
import axios from "axios";
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

        await redis.set(courseId, JSON.stringify(course), "EX", 604800);
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
      // Fetch from MongoDB if not in cache
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestions -courseData.links -courseData.questions"
      );

      return res.status(200).json({
        success: true,
        courses,
      });
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
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Recieved",
        message: `You have a new question in ${courseContent.title}`,
      });
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

// add answer in course question
interface IAnswer {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}
export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId } = req.body as IAnswer;
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
      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Invalid Question Id", 404));
      }
      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // add the answer to the question
      if (!question.questionReplies) {
        question.questionReplies = [];
      }
      question.questionReplies.push(newAnswer);
      await course?.save();
      if (req.user?.id === question.user._id) {
        // create a notification for the user
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Review Received",
          message: `You have a new question reply in ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          sendMail({
            email: question.user.email,
            subject: `Question Reply`,
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// add review in the course
interface IReview {
  rating: number;
  review: string;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExist = userCourseList?.some(
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
      const { review, rating } = req.body as IReview;
      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };
      course?.reviews?.push(reviewData);
      let avgRating = 0;
      course?.reviews?.forEach((review: any) => {
        avgRating += review.rating;
      });
      if (course) {
        if (course && course.reviews) {
          course.rating = avgRating / course.reviews.length;
        }
      }
      await course?.save();
      const notificationData = {
        title: "New Review Recieved",
        message: `${req.user?.name} has given a review on ${course?.name}`,
      };

      // create a notification for the user
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add reply in the review
interface IReviewReply {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReviewReply = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IReviewReply;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Invalid Course Id", 404));
      }
      const review = course?.reviews?.find((item: any) =>
        item._id.equals(reviewId)
      );
      if (!review) {
        return next(new ErrorHandler("Invalid Review Id", 404));
      }
      const newReply: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      review.commentReplies.push(newReply);
      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      await course.save();
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// get all courses --> only for admin
export const getAdminAllcourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCourseService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// delete course --> only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await CourseModel.findById(req.params.id);
      if (!course) {
        return next(new ErrorHandler("User not found", 404));
      }
      await course.deleteOne({ _id: req.params.id });
      await redis.del(req.params.id);
      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Generate video url
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
