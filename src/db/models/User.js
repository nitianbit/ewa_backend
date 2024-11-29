import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: { type: String },
    countryCode: { type: Number, default: 91 },
    createdAt: { type: Number, },
    balance: { type: Number, default: 0 },
    roles: { type: [String] }, // [] --- 0-e -> user enable, 0-d -> user disable, 1-e -> admin enable, 1-d -> admin disable
    address: { type: String },
    city: { type: String },
    company: { type: String, default: '' },
    state: {},
    profiePic: {},
    password: { type: String },
    disabled: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
}, {
    collection: 'User',
});

export const User = mongoose.model('User', schema);

export const USER_TYPE = {
    USER: 1013,
    ADMIN: 1112,
    SUPER_ADMIN: 1211,
    SUPERVISOR: 1310
};

