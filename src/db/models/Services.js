import mongoose from "mongoose";

export const SERVICE_TYPE = {
    LAB_TEST: "Lab Test",
    CONSULTATION: "Consultation",
}

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: false,
        },
        company: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Company",
              required: false,
            },
        active: { type: Boolean, default: true },
        type: { type: String }
    }
);

const Service = mongoose.model('Service', schema);
export default Service


