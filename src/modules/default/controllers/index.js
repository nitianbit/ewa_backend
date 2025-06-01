
import { sendResponse } from "../../../utils/helper.js";
import { handleGridRequest } from "../../../utils/request.js";
import { getModule } from "../utils/helper.js";

export const createRequest = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module);
	console.log(Model);
        const response = await Model.create(req.body);
        sendResponse(res, 200, "success", response);
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, "Something went wrong", error);
    }
}

export const updateRequest = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module);
        const data = await Model.findById(req.body._id);
        if (!data) {
            return sendResponse(res, 404, "Record not found");
        }
        const response = await Model.findByIdAndUpdate(req.body._id, req.body,{new:true});
        sendResponse(res, 200, "success", response);
    } catch (error) {
        sendResponse(res, 500, "Something went wrong", error);
    }
}

export const deleteRequest = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module);
        const data = await Model.findById(req.params.id);
        if (!data) {
            return sendResponse(res, 404, "Record not found");
        }
        const response = await Model.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, "success");
    } catch (error) {
        sendResponse(res, 500, "Something went wrong", error);
    }
}

export const detailRequest = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module);
        const id = req.params.id;
        const response = await Model.findById(id);
        if (!response) {
            return sendResponse(res, 404, "Record not found");
        }
        sendResponse(res, 200, "success", response);
    } catch (error) {
        sendResponse(res, 500, "Something went wrong", error);
    }
}

export const gridRequest = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module);
        const response = await handleGridRequest(req, Model);
        sendResponse(res, 200, "success", response);
    } catch (error) {
        sendResponse(res, 500, "Something went wrong", error);
    }
}
