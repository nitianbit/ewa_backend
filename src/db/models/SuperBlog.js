import mongoose from "mongoose";
import moment from "moment";

// Import the Blog schema
import Blog from "./blog.js";

// Define SuperBlog schema
const superBlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        date: { type: String, required: true },
        blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
        image :{type:String} // Array of Blog references
    },
    {
        collection: 'SuperBlog',
    }
);

// Create the SuperBlog model
const SuperBlog = mongoose.model('SuperBlog', superBlogSchema);

export default SuperBlog;

