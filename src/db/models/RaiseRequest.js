import mongoose from "mongoose";

const raiseRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    serviceRequired: {
      type: String,
      enum: ["second_opinion", "surgery", "vaccination"],
      required: true,
    },
    additionalDetails: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true, collection:"RaiseRequest"}
);

const RaiseRequest = mongoose.model("RaiseRequest", raiseRequestSchema);

export default RaiseRequest;
