import { USER_TYPE, User } from "../../db/models/User.js";
// import { sendEmail } from "../../services/OTP/email.js";
import { sendResponse } from "../../utils/helper.js"
import { checkUserRole, createOrUpdateOTP, createUser, getUser, getUserByEmail, getUserByPhone, modifyRole, verifyOTPQuery } from "./services.js";
import { createToken } from "./middlewares.js";
import { logger } from "../../utils/logger.js";

export const login = async (req, res) => {
    try {
        const { email, phone, countryCode = 91 } = req.body; // phone handle
        if (!email && !phone) return sendResponse(res, 400, "Invalid Request. Please send all the details.");

        let user;

        if (email) {
            user = await getUserByEmail(email);
        } else {
            user = await getUserByPhone(phone, countryCode)
        }

        if (!user) {//don't check for user already exist in google login
            return sendResponse(res, 400, "User not found.");
        }

        await sendOTP(req.body)

        return sendResponse(res, 200, "Success", {
            token: token
        })

    } catch (error) {
        console.log(error);
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const signup = async (req, res) => {
    try {
        const { name, email, phone, countryCode = 91, userType } = req.body; // handle phone
        if (!name || (!email && (!phone && !countryCode)) || !checkUserRole(userType)) return sendResponse(res, 400, "Invalid Request. Please send all the details.");


        if (!USER_TYPE.includes(userType)) {
            return sendResponse(res, 400, "Please enter valid user role.");
        }

        let user = await getUser({
            ...(email && { email }),
            ...(phone && { phone, countryCode }),
            isVerified: false
        })

        if (user) {
            return sendResponse(res, 400, "User already present.");
        }

        let userData = {
            name: req.body.name,
            email: req.body.email,
            countryCode: req.body.countryCode || 91,
            userType: modifyRole(req.body.userType),
            phone: req.body.phone,
        }
        const newUser = await createUser(userData)
        await sendOTP(newUser)

        return sendResponse(res, 200, "Success. User Registed", {})
    } catch (error) {
        console.log(error);
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const sendOTP = async (user = {}) => {
    try {
        const { email, phone, countryCode } = user
        if (!email || (!phone && !countryCode)) return sendResponse(res, 400, "Invalid Request. Please send all the details.");


        let otp = await createOrUpdateOTP(user?._id, email == "email" ? "email" : "phone");
        if (!otp) {
            return sendResponse(res, 400, "OTP is not generated");
        }
        // const isOTPSend = email ? await sendEmail(email, otp) : await sendSMS(countryCode, phone, otp);

        // if (!isOTPSend) {
        //     return sendResponse(res, 400, "Something went wrong.");
        // }
        console.log(otp);
        return sendResponse(res, 200, "Success", { message: "OTP sent successfully" }, { userData: !user ? data : null, otpId: otp?._id });
    } catch (error) {
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const verifyOTP = async (req, res) => {
    try {
        const { otp, otpId } = req.body;
        const user = await User.findById(req.user._id).select("-password -userType").lean();

        const otpData = await verifyOTPQuery(user?._id, otp, otpId);

        const token = createToken(user)

        if (!otpData) {
            return sendResponse(res, 400, "Invalid OTP");
        }

        return sendResponse(res, 200, "Account Verified", user?.isVerified ? token : null);
    } catch (error) {
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -userType").lean();
        return sendResponse(res, 200, "Success", user)
    } catch (error) {
        console.log(error);
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

// export const updateProfile = async (req, res) => {
//     try {
//         const { name, phone, password, countryCode } = req.body;
//         if (!name) {
//             return sendResponse(res, 400, "Invalid Request. Please send all the details.");
//         }
//         if ((phone && !countryCode) || (!phone && countryCode)) {
//             return sendResponse(res, 400, "Invalid Request. Please send all the details.");
//         }
//         const updatedData = {
//             name,
//             ...(phone && { phone }),
//             ...(countryCode && { countryCode }),
//             ...(password && { password: encryptPassword(password) })
//         }
//         const user = await User.findByIdAndUpdate(req.user._id, updatedData).select("-password -userType").lean();
//         if (!user) {
//             return sendResponse(res, 400, "User not found.");
//         }
//         return sendResponse(res, 200, "Success", user)
//     } catch (error) {
//         console.log(error);
//         return sendResponse(res, 500, "Internal Server Error", error);
//     }
// }

