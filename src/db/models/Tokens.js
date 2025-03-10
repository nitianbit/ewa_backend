import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    fcm: { type: String, },
}, {
    collection: 'Tokens',
});

export const Tokens = mongoose.model('Tokens', schema);
