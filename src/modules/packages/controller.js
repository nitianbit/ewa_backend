import mongoose from "mongoose";
import Patient from "../../db/models/Patient.js";
import Vendors from "../../db/models/Vendors.js";
import { sendResponse } from "../../utils/helper.js";
import { showError } from "../../utils/logger.js";
import { execQuery, extractGridRequest } from "../../utils/request.js";
import externalServices from "../externalServices/index.js";
import Package from "../../db/models/Packages.js";


export const packagesGrid = async (request, response) => {
    try {
        const gridRequest = extractGridRequest(request);
        const vendor = request.query.vendor;
        const foundVendor = await Vendors.findById(vendor).lean();
        
        let gridResponse = null;
        delete gridRequest.filters.vendor;
        if(!foundVendor){
            gridResponse = await execQuery(gridRequest, Package);
            return sendResponse(response, 200, "success", gridResponse);
        }

        if (!foundVendor?.external) {
            gridResponse = await execQuery(gridRequest, Package);
        } else {
            let rows = await externalServices.getPackages(vendor);
            gridResponse = {
                rows,
                total: rows?.length,
                page: gridRequest.page,
            }
        }


        return sendResponse(response, 200, "success", gridResponse);
    } catch (error) {
        showError(error);
        return sendResponse(response, 500, "Internal server error", error);
    }
}