import express from "express";
import { activateUser, LoginUser, LogoutUser, registerUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registeration", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", LoginUser);
userRouter.get("/logout-user",isAuthenticated, LogoutUser);

export default userRouter;
