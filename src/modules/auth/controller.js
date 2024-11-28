import { USER_TYPE, User } from "../../db/models/User.js";
import { sendEmail } from "../../services/OTP/email.js";
import { now, sendResponse } from "../../utils/helper.js"
import { createOrUpdateOTP, createUser, getUserByEmail, getUserByPhone, verifyOTPQuery } from "./services.js";
import { comparePassword, createToken, encryptPassword } from "./token_services.js";

export const login = async (req, res) => {
    try {
        const { email, password} = req.body;
        if (!email || !password) return sendResponse(res, 400, "Invalid Request. Please send all the details.");

        const user = await getUserByEmail(email);
        if (!user) {//don't check for user already exist in google login
            return sendResponse(res, 400, "User not found.");
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

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || (!name )) return sendResponse(res, 400, "Invalid Request. Please send all the details.");

        const user = await getUserByEmail(email);
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

        const hashedPassword = encryptPassword(password);
        userData = {
            ...userData,
            password: hashedPassword,
        }
        const newUser = await createUser(userData);
        return sendResponse(res, 200, "Success. User Registed", {})
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const sendOTP = async (req, res) => {
    try {
        const { email, phoneNumber, countryCode, isUserPresent = false } = req.body;
        if (!email || (!phoneNumber && !countryCode)) return sendResponse(res, 400, "Invalid Request. Please send all the details.");
        let user;

        if (email) {
            user = await getUserByEmail(email);
        } else {
            user = await getUserByPhone(phone, countryCode)
        }

        if (isUserPresent && !user) {
            return sendResponse(res, 400, "User not found.");
        }

        let otp = await createOrUpdateOTP(user?._id, email == "email" ? "email" : "phone");
        if (!otp) {
            return sendResponse(res, 400, "OTP is not generated");
        }
        const isOTPSend = email ? await sendEmail(email, otp) : await sendSMS(countryCode, phoneNumber, otp);

        if (!isOTPSend) {
            return sendResponse(res, 400, "Something went wrong.");
        }
        return sendResponse(res, 200, "Success", { message: "OTP sent successfully" });
    } catch (error) {
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
                    expireAt: now() + 300//5 minutes
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
        const { otp, otpId, } = req.body;
        const user = await User.findById(req.user._id).select("-password -userType").lean();

        if (user.verified) {
            return sendResponse(res, 200, "User Already verified", user);
        }

        const otpData = await verifyOTPQuery(user?._id, otp);

        if (!otpData) {
            return sendResponse(res, 400, "Invalid OTP");
        }
        return sendResponse(res, 200, "Account Verified");
    } catch (error) {
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

