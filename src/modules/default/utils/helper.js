import { isValidAdmin, verifyToken } from "../../middlewares/index.js";
import Appointment from "../../../db/models/Appointment.js";
import Availability from "../../../db/models/Availability.js";
import Department from "../../../db/models/Departments.js";
import Doctor from '../../../db/models/Doctors.js'
import Hospital from "../../../db/models/Hospitals.js";
import Laboratory from "../../../db/models/Laboratories.js";
import Offer from "../../../db/models/Offer.js";
import Review from "../../../db/models/Reviews.js";
import mongoose from "mongoose";
import Patient from "../../../db/models/Patient.js";
import { Admins } from "../../../db/models/Admins.js";
import Company from "../../../db/models/Company.js";

export const moduleMiddlewares = {
    'admin': [verifyToken, isValidAdmin],
    'supervisor': [verifyToken],//accessed by admin or supervisor
    'doctors': [verifyToken]
}

export const MODULES = {
    ADMIN: "admin",
    SUPERVISOR: "supervisor",
    DOCTOR: "doctors",
    HOSPITAL: "hospitals",
    LABORATORY: "laboratories",
    DEPARTMENT: "departments",
    AVAILABILITY: "availability",
    APPOINTMENT: "appointments",
    REVIEW: "reviews",
    OFFER: "offer",
    PATIENTS:'patients',
    COMPANY:'company'
};

export const getModule = (module) => {
    switch (module) {
        case MODULES.ADMIN:
            return Admins
            // return moduleMiddlewares.admin;
        case MODULES.SUPERVISOR:
            return moduleMiddlewares.supervisor;
        case MODULES.DOCTOR:
            return Doctor;
        case MODULES.HOSPITAL:
            return Hospital;
        case MODULES.LABORATORY:
            return Laboratory;
        case MODULES.DEPARTMENT:
            return Department;
        case MODULES.AVAILABILITY:
            return Availability;
        case MODULES.APPOINTMENT:
            return Appointment;
        case MODULES.REVIEW:
            return Review;
        case MODULES.OFFER:
            return Offer;
        case MODULES.PATIENTS:
            return Patient;
        case MODULES.COMPANY:
            return Company;
        default:
            break;
    }
};

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);