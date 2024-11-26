import express from 'express'
import { getProfile, login, signup, adminLogin, updateProfile, sendVerificationOTP } from './controller.js';
const authRouter = express.Router();

authRouter.post("/login", login)
authRouter.post("/admin-login", adminLogin)
authRouter.post("/signup", signup),
authRouter.get("/send-verification-mail", sendVerificationOTP);
authRouter.post("/verify", sendVerificationOTP);

authRouter.get("/get", getProfile)
authRouter.put("/update", updateProfile)

export default authRouter;


