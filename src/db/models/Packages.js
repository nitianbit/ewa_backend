import mongoose from "mongoose";
import moment from "moment";

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Cardiology, Neurology
    description: { type: String },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: false,
    },
    image: { type: String },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  }
);

const Package = mongoose.model('Package', Schema);
export default Package
