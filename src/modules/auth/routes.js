import express from 'express'
import { login, signup, sendOTP, verifyOTP, getProfile } from './controller.js';
const authRouter = express.Router();

authRouter.post("/login", login)
authRouter.post("/signup", signup),
authRouter.post("/send-otp", sendOTP),
authRouter.get("/verify-otp", verifyOTP);
authRouter.get("/get", getProfile)

export default authRouter;



