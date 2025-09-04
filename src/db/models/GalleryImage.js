import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    description: { type: String, default: '' },
    image: { type: String, },  
}, {
    collection: 'GalleryImages',
});

export const GalleryImage = mongoose.model('GalleryImage', schema);





