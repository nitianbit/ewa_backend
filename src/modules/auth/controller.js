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

        if (user.isVerified === false) {
            return sendResponse(res, 400, "User not verified.");
        }
        return sendResponse(res, 200, "OTP verification is Pending", user)

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

        let user = await getUser({
            ...(email && { email }),
            ...(phone && { phone, countryCode }),
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
        // await sendOTP(newUser, res)

        return sendResponse(res, 200, "OTP verification is Pending", newUser)
    } catch (error) {
        console.log(error);
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const sendOTP = async (req, res) => {
    try {
        const { email, phone, countryCode, _id } = req.body
        if (!email || (!phone && !countryCode)) return sendResponse(res, 400, "Invalid Request. Please send all the details.");


        let otp = await createOrUpdateOTP(_id, email ? "email" : "phone");
        if (!otp) {
            return sendResponse(res, 400, "OTP is not generated");
        }
        // const isOTPSend = email ? await sendEmail(email, otp) : await sendSMS(countryCode, phone, otp);

        // if (!isOTPSend) {
        //     return sendResponse(res, 400, "Something went wrong.");
        // }
        console.log(otp);
        return sendResponse(res, 200, "OTP sent successfully",  { userId: _id, otpId: otp?._id, otp:otp?.otp });
    } catch (error) {
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const verifyOTP = async (req, res) => {
    try {
        const { otp, otpId, userId } = req.body;
        // const user = await User.findById(req.user._id).select("-password -userType").lean();

        const otpData = await verifyOTPQuery(otp, otpId, userId);

        if (!otpData) {
            return sendResponse(res, 400, "Invalid OTP");
        }
        const user = await getUser({_id:userId})
        if(!user){
            return sendResponse(res, 400, "User not found");
        }
        let token = createToken(user)

        return sendResponse(res, 200, "Account Verified", token);
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

