import express from "express";
import { activateUser, registerUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/registeration", registerUser);
userRouter.post("/activate-user", activateUser);

export default userRouter;
