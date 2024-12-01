import mongoose from "mongoose";
import moment from "moment";

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
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    }, // Optional for individual doctors
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    appointmentDate: { type: Date, required: true },
    timeSlot: {
      start: { type: Number, required: true },  
      end: { type: Number, required: true },  
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No Show"],
      default: "Scheduled",
    },
    fee: { type: Number, required: true }, // Fee for the appointment
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending",
    },
    notes: {
      type: String,
    }, // Optional notes from the patient
    createdAt: {
        type: Number,
        default: moment().unix(),
      },
    updatedAt: { type: Number,  },
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment
