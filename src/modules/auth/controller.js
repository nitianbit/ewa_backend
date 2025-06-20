import { sendResponse } from "../../utils/helper.js"
import { checkUserRole, createOrUpdateOTP, createUser, getUser, getUserByEmail, getUserByPhone, modifyRole, verifyOTPQuery } from "./services.js";
import { createToken, decodeToken } from "./middlewares.js";
import { logger } from "../../utils/logger.js";
import { getModule, MODULES } from "../default/utils/helper.js";
import Patient from "../../db/models/Patient.js";
import { USER_TYPE } from "../../db/models/Admins.js";
import {sendOtp } from "../../utils/email.js";

export const login = async (req, res) => {
    try {
        const { email, phone, countryCode = 91, role = "doctors" } = req.body; // phone handle
        if (!email && !phone) return sendResponse(res, 400, "Invalid Request. Please send all the details.");

        let user;

        const Module = getModule(role)

        if (email) {
            user = await getUserByEmail(email, Module);
        } else {
            user = await getUserByPhone(phone, countryCode, Module)
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
        const { name, email, phone, countryCode = 91, userType, role } = req.body; // handle phone
        if (!name || (!email && (!phone && !countryCode)) || !(role || !checkUserRole(userType))) {
            return sendResponse(res, 400, "Invalid Request. Please send all the details.");
        }

        const Module = getModule(role)

        let user = await getUser({
            ...(email && { email }),
            ...(phone && { phone, countryCode }),

        }, Module);

        const isPatient = [MODULES.PATIENTS].includes(role) || [USER_TYPE.USER].includes(role);

        if (user) {
            return sendResponse(res, 400, "User already present.");
        }

        let userData = {
            name: req.body.name,
            email: req.body.email,
            countryCode: req.body.countryCode || 91,
            // ...(role == "admin" && role),
            role: [role],
            phone: req.body.phone,
            isVerified: isPatient ? false : true, //if patient then mark them as unverfied
            ...( req.body.company &&{company: req.body.company})
        }
        if (!user) {
            user = await createUser(userData, Module)
        }
        // await sendOTP(newUser, res)

        return sendResponse(res, 200, "OTP verification is Pending", user)
    } catch (error) {
        console.log(error);
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const sendOTP = async (req, res) => {
    try {
        const { email, phone, countryCode, _id } = req.body
        if (!email && (!phone && !countryCode)) return sendResponse(res, 400, "Invalid Request. Please send all the details.");


        let otp = await createOrUpdateOTP(_id, email ? "email" : "phone");
        if (!otp) {
            return sendResponse(res, 400, "OTP is not generated");
        }
        // const isOTPSend = email ? await sendEmail(email, otp) : await sendSMS(countryCode, phone, otp);
        const { success, message } = await sendOtp(email, otp?.otp)
        if(!success){
            return sendResponse(res, 500, message, null);
        }

        // if (!isOTPSend) {
        //     return sendResponse(res, 400, "Something went wrong.");
        // }
        console.log(otp);
        return sendResponse(res, 200, "OTP sent successfully", { userId: _id, otpId: otp?._id });
    } catch (error) {
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}


export const verifyOTP = async (req, res) => {
    try {
        const { otp, otpId, userId, role } = req.body;
        // const user = await User.findById(req.user._id).select("-password -userType").lean();

        const Module = getModule(role)

        const otpData = await verifyOTPQuery(otp, otpId, userId, Module, role);

        if (!otpData) {
            return sendResponse(res, 400, "Invalid OTP");
        }
        const user = await getUser({ _id: userId }, Module)
        if (!user) {
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

export const verifyAdmin = (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) return sendResponse(res, 401, "UnAuthorized.");
        const decodedData = decodeToken(token);
        if (!decodedData.success) return sendResponse(res, 401, "UnAuthorized.");
        req.user = { ...decodedData.data };
        return sendResponse(res, 200, "Valid token.", req.user);
    } catch (error) {
        console.log(error)
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

export const getUserProfile = async (req, res) => {
    try {
        const user = await Patient.findById(req.user._id).select("-password -userType").lean();
        return sendResponse(res, 200, "Success", user)
    } catch (error) {
        console.log(error);
        logger.error(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}
