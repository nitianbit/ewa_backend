import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  offerType: {
    type: String,
    enum: ['PERCENTAGE', 'ABSOLUTE'], // 'PERCENTAGE' for percent-off, 'ABSOLUTE' for fixed amount
    required: true,
  },
  value: {
    type: Number,
    required: true, // Discount percentage or fixed amount
  },
  maxAmount: {
    type: Number,
    default: null, // Maximum discount for percentage-based offers
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  applicableToDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  }],
  applicableToLabs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratory',
  }],
  applicableToHospitals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  }],
  applicableToCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  }],
  termsAndConditions: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
}, { timestamps: true });

const Offer = mongoose.model('Offer', OfferSchema);
export default Offer