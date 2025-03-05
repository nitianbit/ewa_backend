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
        type: { type: Number, enum: [1, 2] }, // 1: report, 2: prescription
        notes: { type: String },
        date: { type: Number, default: moment().unix() },
        createdAt: { type: Number, default: moment().unix() },
        attachments: { type: [String] },
        company: { type: String },
        doctor_name: { type: String }, // Add doctor_name field
        laboratory_name: { type: String }, // Add laboratory_name field
    }
);

// Pre-save middleware to populate doctor_name and laboratory_name
schema.pre("save", async function (next) {
    try {
        // Populate doctor_name
        if (this.doctor) {
            const doctor = await mongoose.model("Doctor").findById(this.doctor);
            if (doctor) {
                this.doctor_name = doctor.name; // Assuming doctor has a 'name' field
            }
        }

        // Populate laboratory_name
        if (this.lab) {
            const lab = await mongoose.model("Laboratory").findById(this.lab);
            if (lab) {
                this.laboratory_name = lab.name; // Assuming laboratory has a 'name' field
            }
        }

        // Proceed with saving the document
        next();
    } catch (error) {
        next(error); // Pass any errors to the next middleware or error handler
    }
});

const Report = mongoose.model('Report', schema);
export default Report