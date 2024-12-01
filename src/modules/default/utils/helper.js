import { isValidAdmin, verifyToken } from "../../middlewares/index.js";
import Appointment from "../../../db/models/Appointment.js";
import Availability from "../../../db/models/Availability.js";
import Department from "../../../db/models/Departments.js";
import Doctor from '../../../db/models/Doctors.js'
import Hospital from "../../../db/models/Hospitals.js";
import Laboratory from "../../../db/models/Laboratories.js";
import Offer from "../../../db/models/Offer.js";
import Review from "../../../db/models/Reviews.js";

export const moduleMiddlewares = {
    'admin': [verifyToken, isValidAdmin],
    'supervisor': [verifyToken],//accessed by admin or supervisor
    'doctors':[verifyToken]
}

export const getModule = (module) => {
    switch (module) { 
        case 'admin':
            return moduleMiddlewares.admin;
        case 'supervisor':
            return moduleMiddlewares.supervisor;
        case 'doctors':
            return Doctor
        case 'hospitals':
            return Hospital
        case 'laboratories':
            return Laboratory
        case 'departments':
            return Department
        case 'availability':
            return Availability
        case 'appointments':
            return Appointment
        case 'reviews':
            return Review
        case "offer":
            return Offer
        default:
            break;
    }
}