import RaiseRequest from "../../db/models/RaiseRequest.js";
import { sendResponse } from "../../utils/helper.js";
import { showError } from "../../utils/logger.js";
import { execQuery, extractGridRequest } from "../../utils/request.js";



export const RaiseRequestGrid = async (request, response) => {
    console.log('entered formGrid function');
    try {
        const gridRequest = extractGridRequest(request);

        const gridResponse = await execQuery(gridRequest, RaiseRequest);
        return sendResponse(response, 200, "success", gridResponse);
    } catch (error) {
        showError(error);
        return sendResponse(response, 500, "Internal server error", error);
    }
};

export const handleRaiseRequest = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      email,
      contactNumber,
      address,
      serviceRequired,
      additionalDetails,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !age ||
      !gender ||
      !email ||
      !contactNumber ||
      !address ||
      !serviceRequired
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be provided" });
    }

    // Save new entry
    const newRequest = new RaiseRequest({
      name,
      age,
      gender,
      email,
      contactNumber,
      address,
      serviceRequired,
      additionalDetails,
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error in handleRaiseRequest:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const updateRaiseRequest = async (req, res) => {
  try {
    const { id } = req.params;   // request ID from URL
    const updates = req.body;    // fields to update (e.g., { status: "approved" })

    // Validate allowed fields (optional, but safer)
    const allowedUpdates = [
      "name",
      "age",
      "gender",
      "email",
      "contactNumber",
      "address",
      "serviceRequired",
      "additionalDetails",
      "status",
    ];
    const isValid = Object.keys(updates).every((key) =>
      allowedUpdates.includes(key)
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid update fields" });
    }

    const updatedRequest = await RaiseRequest.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
