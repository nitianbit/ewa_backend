import mongoose from "mongoose";
import moment from "moment";

const LaboratorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    address: { type: String },
    role: { type: [String] },
    contactNumber: { type: String },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    }, // Reference to the hospital if affiliated
    services: [String], // e.g., Blood Test, X-Ray, MRI
    isIndependent: { type: Boolean, default: true }, // true if not part of a hospital
    createdAt: {
      type: Number,
      default: moment().unix(),
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    updatedAt: { type: Number, },
  }
);

const Laboratory = mongoose.model('Laboratory', LaboratorySchema);
export default Laboratory
