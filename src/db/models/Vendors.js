import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    }],
    disabled: { type: Boolean, default: false },
    external: { type: Boolean }
}, {
    collection: 'vendors',
});

const Vendors = mongoose.model('vendors', schema);
export default Vendors
