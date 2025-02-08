import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    description: { type: String, default: '' },
    image: { type: String, },  
}, {
    collection: 'ServiceImages',
});

export const ServiceImage = mongoose.model('ServiceImage', schema);





