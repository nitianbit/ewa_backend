import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    description: { type: String, default: '' },
    image: { type: String, },  
}, {
    collection: 'Events',
});

export const Event = mongoose.model('Event', schema);





