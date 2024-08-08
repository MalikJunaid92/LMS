import express from "express";
import { activateUser, LoginUser, LogoutUser, registerUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/registeration", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", LoginUser);
userRouter.get("/logout-user", LogoutUser);

export default userRouter;
