import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: false },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: false },
    users: { type: [mongoose.Schema.Types.ObjectId], ref: 'Patient', required: false },
    payload: { type: Object },
    notification: { type: Object, default: null },
    scheduledTime: { type: Number, required: true },//timestamp
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
}, { timestamps: true });

export const NotificationModel = mongoose.model('Notification', notificationSchema);