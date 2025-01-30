require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utilis/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import { sendMail } from "../utilis/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utilis/jwt";
import { redis } from "../utilis/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "cloudinary";

// register user
interface IRegistrationBody {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user: IRegistrationBody = {
        email,
        password,
        name,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Account Activation",
          template: "activation-mail.ejs",
          data,
        });
        return res.status(201).json({
          message: `Please check your email:${user.email} to activate your account`,
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
  activationCode: string;
  token: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "10m",
    }
  );
  return { activationCode, token };
};

// activate user account
interface IActivationBody {
  activation_code: string;
  activation_token: string;
}
export const activateAccount = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } = req.body as IActivationBody;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      const userExist = await userModel.findOne({ email });
      if (userExist) {
        return next(new ErrorHandler("User already exist", 400));
      }
      const user = userModel.create({ name, email, password });
      return res.status(201).json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// login user
interface ILoginBody {
  email: string;
  password: string;
}
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginBody;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cookies
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      // Get user ID
      const userId = req.user?._id || req.user?.id || "";

      // Check if userId exists
      if (!userId) {
        return next(new ErrorHandler("User is not authenticated", 400));
      }

      // Delete user session from Redis
      await redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      if (!refresh_token) {
        return next(new ErrorHandler("Refresh token not provided", 400));
      }

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Invalid refresh token", 400));
      }

      const session = await redis.get(decoded.id);

      if (!session) {
        return next(new ErrorHandler("Please login to access this resources", 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", newRefreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days expire
      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user by id

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      if (!userId || typeof userId !== "string") {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      // Call getUserById with the correct parameters (userId as string)
      getUserById(userId, res);
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);

// social auth
interface ISocialAuthBody {
  name: string;
  email: string;
  avatar: string;
}
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ name, email, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);
// update user info
interface IUpdateUserBody {
  name: string;
  email: string;
}
export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserBody;
      const userId = req.user?._id;

      if (!userId || typeof userId !== "string") {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      // Find the user by ID
      const user = await userModel.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if the email is already in use by another user
      if (email && email !== user.email) {
        const emailExist = await userModel.findOne({ email });
        if (emailExist) {
          return next(new ErrorHandler("Email already exists", 400));
        }
        user.email = email;
      }

      // Update the name if provided
      if (name) {
        user.name = name;
      }

      // Save the updated user
      await user.save();

      // Update the user in Redis
      await redis.set(userId, JSON.stringify(user));

      // Send the response
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdatePasswor {
  oldPassword: string;
  newPassword: string;
}
export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePasswor;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      // Ensure password field is selected
      const user = await userModel.findById(req.user?._id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (!user.password) {
        return next(
          new ErrorHandler(
            "Password update not allowed for social auth users",
            400
          )
        );
      }

      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;
      await user.save();
      await redis.set(req.user?._id as string, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);
// update user avatar
interface IUpdateAvatar {
  avatar: string;
}
export const updateProfileImage = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateAvatar;
      const userId = req.user?._id?.toString(); // Ensure userId is a string

      if (!userId) {
        return next(new ErrorHandler("User ID not found in request", 400));
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (!avatar) {
        return next(new ErrorHandler("Avatar is required", 400));
      }

      // Delete existing avatar if present
      if (user.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      // Upload new avatar to Cloudinary
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      // Update user's avatar
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      // Save updated user
      await user.save();
      await redis.set(userId, JSON.stringify(user)); // Ensure userId is a string

      // Respond with success and updated user
      return res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message || "Server Error", 500));
    }
  }
);

// get all users --> only admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// update user role --> only admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      updateUserRoleService(id, role, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// delete user --> only admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await user.deleteOne({ _id: req.params.id });
      await redis.del(req.params.id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
      
    }
  })