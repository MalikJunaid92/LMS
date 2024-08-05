import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
const EmailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: {
    public_id: string;
    url: string;
  };
  isverified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
}
const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      validator: function (email: string) {
        return EmailRegexPattern.test(email);
      },
      message: "Please enter a valid email!",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true,"Please enter a password!"],
    minlength:[6,"Password must be at least 6 character!"],
    select: false,
  },
  role: {},
});
