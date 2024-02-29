import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' , required: true},
    content: { type: String, required: true },
    date : { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' , required: true},
    date: { type: Date, default: Date.now },
    content: {type: String, required: true},
    image: {type: String, required: false},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [commentSchema]
});

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
