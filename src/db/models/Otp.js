import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // Reference to User
    otp: { type: String, required: true }, // OTP value
    target: { type: String,enum: ['phone', 'email'], required: true }, // Phone number or email address
    createdAt: { type: Date }, // Automatically deletes after 5 minutes
    expireAt: { type: Date, default: Date.now, expires: 3600 }, // Automatically deletes after 5 minutes
    isVerified: { type: Boolean, default: false } // Status of OTP
}, {
    collection: 'OTP',
});

export const OTP = mongoose.model('OTP', otpSchema);