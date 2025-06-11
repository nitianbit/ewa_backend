
import { sendResponse } from "../../../utils/helper.js";
import { handleGridRequest } from "../../../utils/request.js";
import externalServices from "../../externalServices/index.js";
import { getModule, MODULES } from "../utils/helper.js";
import { sendNotification } from "../../../utils/email.js";

export const createRequest = async (req, res) => {
    try {
        const module = req.params.module;
        const Model = getModule(module);
        const response = await Model.create(req.body);
        if (module === MODULES.APPOINTMENT) {
            await externalServices.createBooking({
                appointmentData: req.body,
                user: req.user
            })
        }
        if (module === MODULES.APPOINTMENT) {
            const emailNotification = [
                "healthcaremyewa@gmail.com",
                "support@myewacare.com",
                response.patient_email,
            ];

            // Fire-and-forget the async email notification
            (async () => {
                try {
                    const { success, message } = await sendNotification(emailNotification, response);
                    console.log("Email status:", message);

                    if (!success) {
                        console.warn("Email failed to send, but appointment was created.");
                    }
                } catch (emailError) {
                    console.error("Error sending notification email:", emailError);
                }
            })();

            (async () => {
                try {
                    const moment = (await import('moment')).default;
                    const appointmentTime = moment.unix(appointment.appointmentDate)
                        .hour(Number(appointment.timeSlot.start.slice(0, 2)))
                        .minute(Number(appointment.timeSlot.start.slice(2)))
                        .second(0);

                    const notificationTimes = [
                        { label: "24h", offset: 24 },
                        { label: "10h", offset: 10 },
                        { label: "4h", offset: 4 },
                        { label: "1h", offset: 1 },
                        { label: "30min", offset: 0.5 },
                    ];

                    const now = moment();

                    for (const { label, offset } of notificationTimes) {
                        const scheduleTime = moment(appointmentTime).subtract(offset, 'hours');

                        if (scheduleTime.isAfter(now)) {
                            const formattedTime = moment(appointmentTime).format("h:mm A"); // Format time properly
                            const payload = {
                                type: "appointment_reminder",
                                appointmentId: appointment._id,
                                timing: label
                            };

                            const notification = {
                                title: "Appointment Reminder",
                                body: `You have an appointment scheduled at ${formattedTime} on ${appointmentTime.format("YYYY-MM-DD")}`,
                            };

                            await NotificationModel.create({
                                user_id: appointment.patient,
                                company_id: appointment.company,
                                payload,
                                notification,
                                scheduledTime: scheduleTime.unix(),
                                status: "pending",
                            });
                        }
                    }

                } catch (e) {
                    console.error("Error scheduling future notifications:", e);
                }
            })();
        }

        sendResponse(res, 200, "success", response);
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, error?.message ?? "Something went wrong", error);
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

        Object.assign(data, req.body);  // Merge updates
        const response = await data.save();  // Triggers pre("save") middleware

        sendResponse(res, 200, "success", response);
    } catch (error) {
        sendResponse(res, 500, "Something went wrong", error);
    }
};


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
