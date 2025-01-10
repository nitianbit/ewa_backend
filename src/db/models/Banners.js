import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    company: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, },
    active: { type: Boolean, default: false },
    expireAt: { type: Number },
}, {
    collection: 'Banners',
});

export const Banners = mongoose.model('Banners', schema);





