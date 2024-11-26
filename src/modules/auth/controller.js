import { OTP } from "../../db/models/Otp.js";
import { USER_TYPE, User } from "../../db/models/User.js";
import { sendEmail } from "../../services/email.js";
import { VerifyGoogleIdToken } from "../../services/google.js";
import { now, sendResponse } from "../../utils/helper.js"
import { comparePassword, createToken, encryptPassword } from "./services.js";

export const login = async (req, res) => {
    try {
        const { email, password, type = "auth" } = req.body;
        if (!email || !password) return sendResponse(res, 400, "Invalid Request. Please send all the details.");

        let user = await User.findOne({ email }).lean();
        if (!user && type == 'auth') {//don't check for user already exist in google login
            return sendResponse(res, 400, "User not found.");
        }
        if (type == 'google') {
            const data = await VerifyGoogleIdToken(password);
            //if (!user) then create user in case of google login
            if (!user) {
                const newUser = new User({
                    name: data.name,
                    email: data.email,
                    countryCode: 91,
                    userType: USER_TYPE.USER
                })
                await newUser.save();
                user = await User.findOne({ email }).lean();
            }
        } else {
            const isPassMatched = comparePassword(password, user.password);
            if (!isPassMatched) {
                return sendResponse(res, 400, "Wrong password.");
            }
        }

        const token = createToken({
            _id: user._id,
            email: user.email,
            countryCode: user.countryCode,
            userType: user.userType,
        });

        return sendResponse(res, 200, "Success", {
            token: token
        })

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const signup = async (req, res) => {
    try {
        const { email, password, name, type = "auth" } = req.body;
        if (!email || !password || (!name && type == "auth")) return sendResponse(res, 400, "Invalid Request. Please send all the details.");

        const user = await User.findOne({ email }).lean();
        if (user) {
            return sendResponse(res, 400, "User already present.");
        }
        const xApiKey = req.headers['x-api-key'];
        let userData = {
            name: name,
            email: email,
            countryCode: 91,
            userType: xApiKey === 'admin' ? USER_TYPE.ADMIN : USER_TYPE.USER
        }
        if (type == "auth") {
            const hashedPassword = encryptPassword(password);
            userData = {
                ...userData,
                password: hashedPassword,
            }
        }
        if (type === 'google') {
            //passing idToken in password
            const data = await VerifyGoogleIdToken(password)
            // if(data.email!=email){} //TODO handle this
            userData = {
                ...userData,
                email: data?.email,
                loginType: 'google',
                verified: true
            }
        }
        //check header here if x-api-key present then it is admin else user


        const newUser = new User(userData)
        await newUser.save();
        return sendResponse(res, 200, "Success. User Registed", {})
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -userType").lean();
        return sendResponse(res, 200, "Success", user)
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, phone, password, countryCode } = req.body;
        if (!name) {
            return sendResponse(res, 400, "Invalid Request. Please send all the details.");
        }
        if ((phone && !countryCode) || (!phone && countryCode)) {
            return sendResponse(res, 400, "Invalid Request. Please send all the details.");
        }
        const updatedData = {
            name,
            ...(phone && { phone }),
            ...(countryCode && { countryCode }),
            ...(password && { password: encryptPassword(password) })
        }
        const user = await User.findByIdAndUpdate(req.user._id, updatedData).select("-password -userType").lean();
        if (!user) {
            return sendResponse(res, 400, "User not found.");
        }
        return sendResponse(res, 200, "Success", user)
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return sendResponse(res, 400, "Invalid Request. Please send all the details.");

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return sendResponse(res, 400, "User not found.");
        }
        if (user.userType !== USER_TYPE.ADMIN) {
            return sendResponse(res, 400, 'Only Admins are allowed for this operation.')
        }
        const isPassMatched = comparePassword(password, user.password);
        if (!isPassMatched) {
            return sendResponse(res, 400, "Wrong password.");
        }

        const token = createToken({
            _id: user._id,
            email: user.email,
            countryCode: user.countryCode,
            userType: user.userType,
        });

        return sendResponse(res, 200, "Success", {
            token: token
        })

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const sendVerificationOTP = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -userType").lean();
        if (user.verified) {
            return sendResponse(res, 200, "User Already verified", user);
        }
        const otpData = await OTP.findOne({ user_id: user._id, expireAt: { $gt: now() } }).lean();//check valid otp
        let otp = null;
        //if not expired used the current otp
        if (otpData.otp) {
            otp = otpData.otp;
        } else {
            otp = Math.floor(1000 + Math.random() * 9000);

            await OTP.findOneAndUpdate(
                { user_id: user._id }, 
                { 
                    otp, 
                    expireAt:now() + 300//5 minutes
                }, 
                { 
                    upsert: true, 
                    setDefaultsOnInsert: true 
                }
            );
        }
        if (!otp) {
            return sendResponse(res, 400, "Something went wrong.");
        }
        await sendEmail(user.email, otp);
        return sendResponse(res, 200, "Success", user);
    } catch (error) {
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const verifyOTP = async (req, res) => {
    try {

        const { otp } = req.body;
        const user = await User.findById(req.user._id).select("-password -userType").lean();

        if (user.verified) {
            return sendResponse(res, 200, "User Already verified", user);
        }

        const otpData = await OTP.findOne({ user_id: user._id, expireAt: { $gt: now() } }).lean();//check

        if (!otpData) {
            return sendResponse(res, 400, "Invalid OTP");
        }
        if (otpData.otp != otp || otpData.expireAt < now()) {
            return sendResponse(res, 400, "Invalid OTP");
        }
        await User.findByIdAndUpdate(user._id, { verified: true });
        await OTP.deleteMany({ user_id: user._id });
        return sendResponse(res, 200, "Account Verified");
    } catch (error) {
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}     