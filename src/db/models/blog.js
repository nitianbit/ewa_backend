import mongoose from "mongoose";
import moment from "moment";


const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        description: { type: String, required: true }, // HTML content
        image: { type: String, },       // image URL
        createdAt: { type: Number, default: moment().unix() }
    },
    {
        collection: 'Blog',
    }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
