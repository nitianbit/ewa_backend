import express from 'express'
import { login, signup, sendOTP, verifyOTP, getProfile, verifyToken, getUserProfile } from './controller.js';
const authRouter = express.Router();

authRouter.post("/login", login)
authRouter.post("/signup", signup),
authRouter.post("/send-otp", sendOTP),
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/verify-token", verifyToken);
authRouter.get("/getAdminProfile", getProfile);
authRouter.get("/profile",verifyToken, getUserProfile);

export default authRouter;



