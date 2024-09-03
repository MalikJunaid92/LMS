require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utilis/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utilis/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utilis/jwt";
// import { redis} from "../utilis/redis";


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
// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const { email, name, password } = newUser.user;
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// Login user
interface ILoginUser {
  email: string;
  password: string;
}
export const LoginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginUser;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email or password", 400));
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const LogoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if the user is authenticated
      if (!req.user || !req.user._id) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      // Clear the cookies
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // Send success response
      res.status(200).json({
        success: true,
        message: "Logout successful!",
      });
    } catch (error) {
      return next(new ErrorHandler((error as Error).message, 500));
    }
  }
);



// update access token
export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      
      if (!refresh_token) {
        return next(new ErrorHandler("Refresh token is missing", 400));
      }

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      
      if (!decoded) {
        return next(new ErrorHandler(message, 404));
      }

      // Fetch the user session from the database using the decoded ID
      const userSession = await userModel.findById(decoded.id);
      
      if (!userSession) {
        return next(new ErrorHandler(message, 404));
      }

      // Generate a new access token for the user
      const newAccessToken = jwt.sign(
        { id: userSession._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn:  "5m" }
      );
      const newRefreshToken = jwt.sign(
        { id: userSession._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn:  "30d" }
      );

      res.cookie("access_token",newAccessToken,accessTokenOptions)
      res.cookie("refresh_token",newRefreshToken,refreshTokenOptions)
      res.status(200).json({
        status:"success",
        newAccessToken
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
