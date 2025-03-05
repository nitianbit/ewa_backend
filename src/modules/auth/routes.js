import express from 'express'
import { login, signup, sendOTP, verifyOTP, getProfile, getUserProfile, verifyAdmin } from './controller.js';
import { verifyToken } from '../middlewares/index.js';
const authRouter = express.Router();

authRouter.post("/login", login)
authRouter.post("/signup", signup),
authRouter.post("/send-otp", sendOTP),
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/verify-token", verifyAdmin);
authRouter.get("/getAdminProfile", getProfile);
authRouter.get("/profile",verifyToken, getUserProfile);

export default authRouter;



