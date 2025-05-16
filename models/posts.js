const Mongoose = require("mongoose");

const postSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String // URL to the image
    },
    likes: {
        type: Number,
        default: 0
    },
    // Array to track which users have liked this post
    likedBy: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    readTime: {
        type: String // e.g., "10 min"
    },
    postedDate: {
        type: Date,
        default: Date.now
    }
});

const postModel = Mongoose.model("posts", postSchema);
module.exports = postModel;