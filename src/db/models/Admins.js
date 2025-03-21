import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: { type: String, unique: true, required: true },
    countryCode: { type: Number, default: 91 },
    createdAt: { type: Number, },
    role: { type: [String] }, // [] --- 0-e -> user enable, 0-d -> user disable, 1-e -> admin enable, 1-d -> admin disable
    company: { type: String, default: '' },
    profiePic: {type: String,},
    disabled: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
}, {
    collection: 'Admins',
});

export const Admins = mongoose.model('Admins', schema);

export const USER_TYPE = {
    USER: "1013-e",
    ADMIN: "admin",
    SUPER_ADMIN: "1211-e",
    SUPERVISOR: "supervisor"
  };
  
  


