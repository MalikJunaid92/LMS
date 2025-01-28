import mongoose, { Model, Schema, Document } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  links: ILink[];
  suggestion?: string;
  questions?: IComment[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisite: { title: string }[];
  reviews?: IReview[];
  courseData: ICourseData[]; // Corrected to expect an array
  purchased?: number;
  rating?: number;
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
});

const courseDataSchema = new Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoSection: String,
  videoLength: Number,
  links: [linkSchema], // Corrected to be an array of links
  suggestion: String,
  questions: [commentSchema], // Optional array of comments/questions
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: [true, "Please enter course name"],
  },
  description: {
    type: String,
    required: [true, "Please enter course description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter course price"],
  },
  estimatedPrice: Number,
  tags: {
    type: String,
    required: [true, "Please enter course tags"],
  },
  level: {
    type: String,
    required: [true, "Please enter course level"],
  },
  demoUrl: {
    type: String,
    required: [true, "Please enter course demo url"],
  },
  benefits: [
    {
      title: String,
    },
  ],
  prerequisite: [
    {
      title: String,
    },
  ],
  reviews: [reviewSchema], // Array of reviews
  courseData: [courseDataSchema], // Array of course data
  purchased: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
