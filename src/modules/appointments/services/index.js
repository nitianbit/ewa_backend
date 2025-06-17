import moment from "moment";
import { Tokens } from "../../../db/models/Tokens";
import { sendNotification } from "../../../utils/email";
import { isValidObjectId } from "../../default/utils/helper";
import { NotificationModel } from "../../../db/models/Notifications";
import { showError } from "../../../utils/logger";


export const appointmentBookingEmailNotification = async (payload) => {
    try {
        const emailNotification = [
            "healthcaremyewa@gmail.com",
            "support@myewacare.com",
            payload.patient_email,
        ];
        const { success, message } = await sendNotification(emailNotification, payload);
        console.log("Email status:", message);

        if (!success) {
            console.warn("Email failed to send, but appointment was created.");
        }
    } catch (emailError) {
        console.error("Error sending notification email:", emailError);
    }
}


export const scheduleNotificationAppointmentBooking = async (appointment) => {
    try {
        const notification = {
            notification: {
                title: "Appointment Booked",
                body: "You have successfully booking your appointment"
            },
            // scheduledTime: moment().unix(),//timestamp
            // status: "pending"
        }
        const patientId = isValidObjectId(appointment?.patient) ? appointment.patient?.toString() : appointment?.patient
        const fcm = await Tokens.findOne({ user_id: patientId });
        if (fcm) {
            //send instant notificaion
            await this.sendNotification({
                fcm_id: fcm.fcm,
                data: notification.data,
                notification: notification.notification
            });
        }
        const appointmentDate = appointment?.appointmentDate;
        const appointmentTime = appointment?.timeSlot?.start;
        const appointmentDateTime = moment(`${appointmentDate} ${appointmentTime}`, 'YYYYMMDD HHmm').unix();
        const appointmentMoment = moment(`${appointmentDate} ${appointmentTime}`, 'YYYYMMDD HHmm');

        if (!appointmentMoment.isValid()) {
            console.warn('Invalid appointment datetime');
            return;
        }


        const reminders = [
            {
                time: appointmentMoment.clone().subtract(1, 'day'),
                body: "Your appointment is scheduled for tomorrow."
            },
            {
                time: appointmentMoment.clone().subtract(15, 'minutes'),
                body: "Your appointment starts in 15 minutes."
            }
        ];
        const currentTime = moment().unix();
        for (const reminder of reminders) {
            try {
                if (reminder.time.isAfter(currentTime)) {
                    const object = new NotificationModel({
                        notification: {
                            title: "Appointment Reminder",
                            body: reminder.body
                          },              
                        scheduledTime: reminder.time.unix(),
                        status: 'pending',
                        user_id: patientId
                    })
                    await object.save()
                }
            } catch (error) {

            }
        }

    } catch (error) {
        showError(error);
    }
}