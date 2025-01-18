import { USER_TYPE } from "../../db/models/Admins.js";
import Appointment from "../../db/models/Appointment.js";
import Patient from "../../db/models/Patient.js";
import { sendResponse } from "../../utils/helper.js";
import { showError } from "../../utils/logger.js";
import { execQuery, extractGridRequest } from "../../utils/request.js";
import { MODULES } from "../default/utils/helper.js";


export const patientGrid = async (request, response) => {
    try {
        const gridRequest = extractGridRequest(request);
        const role=request.user.role;
        const isDoctor=role.includes(MODULES.DOCTOR)
        const isLaboratory=role.includes(MODULES.LABORATORY)

        if (isDoctor || isLaboratory) {
            const appointments=await Appointment.find({
                ...(isDoctor && {doctor: request.user._id}),
                ...(isLaboratory && {laboratory: request.user._id}),
            }).select("patient").lean();
            gridRequest.filters["_id"] = {
                $in: appointments.map((appointment) => appointment.patient),
            };
         }

        const gridResponse = await execQuery(gridRequest, Patient);
        return sendResponse(response, 200, "success", gridResponse);
    } catch (error) {
        showError(error);
        return sendResponse(response, 500, "Internal server error", error);
    }
}