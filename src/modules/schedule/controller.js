import { sendResponse } from "../../utils/helper.js";
import { showError } from "../../utils/logger.js";
import externalServices from "../externalServices/index.js"
4

export const fetchAvailableSlots = async (req, res) => {
    try {
        const { vendor, date, latitude, longitude, zipCode } = req.query
        const slots = await externalServices.getSlots(vendor, date, latitude, longitude, zipCode);
        return sendResponse(res, 200, "", slots);
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, error?.message??"Something went wrong", null)
    }
}
export const fetchAvailablePackages = async (req, res) => {
    try {
        const packages = await externalServices.getPackages(req.query.vendor);
        return sendResponse(res, 200, "", packages);
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Something went wrong", null)
    }
}