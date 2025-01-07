import express from 'express'
import { login, signup, sendOTP, verifyOTP, getProfile, verifyToken } from './controller.js';
const authRouter = express.Router();

authRouter.post("/login", login)
authRouter.post("/signup", signup),
authRouter.post("/send-otp", sendOTP),
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/verify-token", verifyToken);
authRouter.get("/getAdminProfile", getProfile)

export default authRouter;



