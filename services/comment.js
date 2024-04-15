import Post from "../models/post.js";
import urlFilterServices from "./urlFilterServices.js";

const getComments = async (postId) => {
    return await Post.findById(postId, 'comments')
        .populate('comments.author', 'name image')
        .sort({ date: -1 })
        .exec();
}

const createComment = async (userId, postId, commentData) => {
    const newComment = {
        author: userId,
        content: commentData.content,
    }
    await urlFilterServices.validateContent(commentData.content);
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
    post.comments.push(newComment);
    await post.save();
    const updatedPost = await Post.findById(postId, 'comments')
        .populate('comments.author', 'name image')
        .exec();
    
    const populatedComment = updatedPost.comments[updatedPost.comments.length - 1];
    return populatedComment;
}

const updateComment = async (postId, commentId, commentData) => {
    await urlFilterServices.validateContent(commentData.content);
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
        const error = new Error('Comment not found');
        error.code = 404;
        throw error;
    }

    comment.content = commentData.content;
    await post.save();
}

const deleteComment = async (postId, commentId) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
        const error = new Error('Comment not found');
        error.code = 404;
        throw error;
    }
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();
}

export default {
    getComments,
    createComment,
    updateComment,
    deleteComment
};

