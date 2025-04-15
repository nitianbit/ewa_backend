import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    disabled: { type: Boolean, default: false },
}, {
    collection: 'vendors',
});

const Vendors = mongoose.model('vendors', schema);
export default Vendors
