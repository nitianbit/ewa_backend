import Form from "../../db/models/form.js";
import { sendResponse } from "../../utils/helper.js";
import { showError } from "../../utils/logger.js";
import { execQuery, extractGridRequest } from "../../utils/request.js";



export const formGrid = async (request, response) => {
    console.log('entered formGrid function');
    try {
        const gridRequest = extractGridRequest(request);

        const gridResponse = await execQuery(gridRequest, Form);
        return sendResponse(response, 200, "success", gridResponse);
    } catch (error) {
        showError(error);
        return sendResponse(response, 500, "Internal server error", error);
    }
};

export const handleFormCreateRequest = async (req, res) => {
    try {
        const { full_name,age, gender, email, mobile, address, enquire_about } = req.body;
        // console.log(req.body);

        if (!full_name ||!age ||!gender || !email || !mobile || !address || !enquire_about) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newFormEntry = new Form({
            full_name,
            age,
            gender,
            email,
            mobile,
            address,
            enquire_about,
        });

        await newFormEntry.save();

        return res.status(201).json({ success: true, message: "Form submitted successfully", data: newFormEntry });
    } catch (error) {
        showError(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};