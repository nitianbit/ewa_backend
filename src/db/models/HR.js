import mongoose from "mongoose";
import moment from "moment";

const HRSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: Number,
    countryCode: { type: Number, default: 91 },
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

const HR = mongoose.model('HR', HRSchema);
export default HR;

