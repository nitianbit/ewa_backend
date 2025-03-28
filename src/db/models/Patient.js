import mongoose from 'mongoose'
import { USER_TYPE } from './Admins.js';

const schema = new mongoose.Schema({
    name: String,
    phone: Number,
    age: Number,
    height: {type:Number}, //cm
    weight: {type:Number}, //kg
    email: { type: String },
    countryCode: { type: Number, default: 91 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] }, // Male - M, FeMale - F, Other - O
    createdAt: { type: Number, },
    balance: { type: Number, default: 0 },
    role: { type: [String] }, // [] --- 0-e -> user enable, 0-d -> user disable, 1-e -> admin enable, 1-d -> admin disable
    address: { type: String },
    city: { type: String },
    company: { type: String, default: '' },
    state: { type: String },
    profiePic: { type: String },
    password: { type: String },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    disabled: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
}, {
    collection: 'Patient',
});

const Patient = mongoose.model('Patient', schema);
export default Patient
