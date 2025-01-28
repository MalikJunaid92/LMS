require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const EmailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  isverified: boolean;
  role: string;
  courses: Array<{ courseId: string }>;
  comparePassword: (Password: string) => Promise<boolean>;
  signAccessToken: () =>string;
  singRefreshToken: () =>string;
}
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return EmailRegexPattern.test(value);
        },
        message: "Please enter a valid email address",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Your password must be longer than 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);
// signaccess token
UserSchema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '',{
    expiresIn: '5m',
  });
};
// sign refresh token
UserSchema.methods.singRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '',{
    expiresIn: '3d',
  });
}
// hash password before saving user
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// compare user password
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default userModel;
