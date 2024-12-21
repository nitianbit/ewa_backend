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
      enum: ["SCHD", "COMP", "CNCL", "NOSH"],  //SCHEDULED: "SCHD", COMPLETED: "COMP", CANCELLED: "CNCL", NO_SHOW: "NOSH"
      default: "SCHD",
    },
    fee: { type: Number, required: true }, // Fee for the appointment
    paymentStatus: {
      type: String,
      enum: ["PD", "PND", "FLD"], //PAID: "PD", PENDING: "PND", FAILED: "FLD"
      default: "PND",
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
