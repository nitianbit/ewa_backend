import { isValidAdmin, isValidSupervisor, verifyToken } from "../../middlewares/index.js";
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
import { Wellness } from "../../../db/models/Wellness.js";
import Service from "../../../db/models/Services.js";
import { Banners } from "../../../db/models/Banners.js";
import HR from "../../../db/models/HR.js"
import Report from "../../../db/models/Report.js";
import { ServiceImage } from "../../../db/models/ServiceImage.js";
import Package from "../../../db/models/Packages.js";
import { NotificationModel } from "../../../db/models/Notifications.js";
import Form from "../../../db/models/form.js";
import Blog from "../../../db/models/blog.js";
import Vendors from "../../../db/models/Vendors.js";

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
    PATIENTS: 'patients',
    COMPANY: 'company',
    WELLNESS: 'wellness',
    SERVICES: 'services',
    HR: "hr",
    REPORT: 'report',
    SERVICE_IMAGES: 'service-images',
    PACKAGES: 'package',
    NOTIFICATION:'notification',
    FORM:'form',
    BLOGS:'blogs',
    VENDORS:'vendors'
};

export const moduleMiddlewares = {
    'admin': [verifyToken, isValidAdmin],
    'supervisor': [verifyToken, isValidSupervisor],//accessed by admin or supervisor
    'doctors': [verifyToken],
    [MODULES.PATIENTS]: [verifyToken],
    [MODULES.NOTIFICATION]: [verifyToken],
    [MODULES.FORM]: [verifyToken],
}



export const getModule = (module) => {
    switch (module) {
        case MODULES.ADMIN:
            return Admins
        // return moduleMiddlewares.admin;
        case MODULES.SUPERVISOR:
            return Admins
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
        // case MODULES.OFFER:
        //     return Offer;
        case MODULES.PATIENTS:
            return Patient;
        case MODULES.COMPANY:
            return Company;
        case MODULES.WELLNESS:
            return Wellness;
        case MODULES.SERVICES:
            return Service;
        case MODULES.OFFER:
            return Banners;
        case MODULES.HR:
            return HR
        case MODULES.REPORT:
            return Report;
        case MODULES.SERVICE_IMAGES:
            return ServiceImage;
        case MODULES.PACKAGES:
            return Package;
        case MODULES.NOTIFICATION:
            return NotificationModel;
        case MODULES.FORM:
            return Form;
        case MODULES.BLOGS:
            return Blog;
        case MODULES.VENDORS:
            return Vendors;
        default:
            break;
    }
};

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);