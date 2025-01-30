import express from "express";
import {
  activateAccount,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfileImage,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate-user", activateAccount);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfileImage);
userRouter.get("/get-users", isAuthenticated, authorizeRoles("admin"),getAllUsers);
userRouter.put("/update-user", isAuthenticated, authorizeRoles("admin"),updateUserRole);
userRouter.delete("/delete-user/:id", isAuthenticated, authorizeRoles("admin"),deleteUser);
export default userRouter;
