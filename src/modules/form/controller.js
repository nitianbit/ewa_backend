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
        const { first_name, last_name, gender, email, mobile, address, enquire_about } = req.body;
        // console.log(req.body);

        if (!first_name || !last_name || !gender || !email || !mobile || !address || !enquire_about) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await Form.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Mobile already exists" });
        }

        const newFormEntry = new Form({
            first_name,
            last_name,
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