import mongoose from "mongoose";
import moment from "moment";
import { APPOINTMENT_STATUS, PAYMENT_STATUS } from "../../utils/constants.js";

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    appointmentDate: { type: Number, required: true },
    timeSlot: {
      start: { type: Number, required: true },
      end: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS), // SCHEDULED: "SCHD", COMPLETED: "COMP", CANCELLED: "CNCL", NO_SHOW: "NOSH"
      default: APPOINTMENT_STATUS.SCHEDULED,
    },
    fee: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS), // PAID: "PD", PENDING: "PND", FAILED: "FLD"
      default: PAYMENT_STATUS.PENDING,
    },
    notes: {
      type: String,
    },
    createdAt: {
      type: Number,
      default: moment().unix(),
    },
    updatedAt: { type: Number },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laboratory",
    },
    type: { type: Number, enum: [1, 2] }, // 1: report, 2: prescription
    doctor_name: { type: String },
    department_name: { type: String },
    laboratory_name: { type: String },
    department_image: { type: String }, // Add department_image field to store the image URL
  }
);

// Pre-save middleware to populate doctor_name, department_name, laboratory_name, and department_image
AppointmentSchema.pre("save", async function (next) {
  try {
    // Populate doctor_name
    if (this.doctor) {
      const doctor = await mongoose.model("Doctor").findById(this.doctor);
      if (doctor) {
        this.doctor_name = doctor.name; // Assuming doctor has a 'name' field
      }
    }

    // Populate department_name and department_image
    if (this.department) {
      const department = await mongoose.model("Department").findById(this.department);
      if (department) {
        this.department_name = department.name; // Assuming department has a 'name' field
        this.department_image = department.image; // Assuming department has an 'image' field
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

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;