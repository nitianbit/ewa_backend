import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    title: String,
    startTime: Number,
    description: { type: String, },
    countryCode: { type: Number, default: 91 },
    images: { type: [String] },
    createdAt: { type: Number, },
    active: { type: Boolean, default: true },
    company: { type: String, default: '' },
    
}, {
    collection: 'Wellness',
});

export const Wellness = mongoose.model('Wellness', schema);
 
  
  


