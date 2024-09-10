import express from "express";
import { activateUser, getUserInfo, LoginUser, LogoutUser, registerUser, socialAuth, updateAccessToken, updateUserInfo, updateUserPassword } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registeration", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", LoginUser);
userRouter.get("/logout-user",isAuthenticated, LogoutUser);
userRouter.get("/refresh",updateAccessToken)
userRouter.get("/me",isAuthenticated,getUserInfo)
userRouter.post("/social-auth",socialAuth)
userRouter.put("/update-user-info",isAuthenticated,updateUserInfo)
userRouter.put("/update-user-password",isAuthenticated,updateUserPassword)
export default userRouter;
