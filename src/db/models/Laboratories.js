import mongoose from "mongoose";
import moment from "moment";

const LaboratorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    address: { type: String },
    role: { type: [String] },
    description: { type: String },
    contactNumber: { type: String },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    }, // Reference to the hospital if affiliated
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    isIndependent: { type: Boolean, default: true }, // true if not part of a hospital
    createdAt: {
      type: Number,
      default: moment().unix(),
    },
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
      },
    ],
    updatedAt: { type: Number, },
  }
);

const Laboratory = mongoose.model('Laboratory', LaboratorySchema);
export default Laboratory
