require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utilis/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utilis/sendMail";
// register User

interface IRegisteration {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user: IRegisteration = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      // const html = await ejs.renderFile(
      //   path.join(__dirname, "../mails/activation-mail.ejs")
      // );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          status: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_TOKEN_SECRET as Secret,
    {
      expiresIn: "1h",
    }
  );
  return { token, activationCode };
};