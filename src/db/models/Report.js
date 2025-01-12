import moment from "moment";
import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
        },
        lab: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Laboratory',
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
        },
        type: { type: Number, enum: [1, 2] },//1:report,2:prescription
        notes: { type: String },
        date: { type: Number, default: moment().unix() },
        createdAt: { type: Number, default: moment().unix() },
        attachments: { type: [String] },
        company: { type: String }
    }
);

const Report = mongoose.model('Report', schema);
export default Report
