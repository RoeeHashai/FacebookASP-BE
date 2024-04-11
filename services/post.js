import Post from "../models/post.js";
import urlFilterServices from "./urlFilterServices.js";

const getPosts = async (userId) => {
    let posts = await Post.find({ author: userId })
        .populate('author', 'name image')
        .sort({ date: -1 })
        .exec();

    posts = posts.map(post => {
        const obj = post.toObject();
        obj.commentsLength = post.comments.length;
        delete obj.comments;
        return obj;
    });

    return posts;
};

function findUrls(postContent) {
    const urlRegex = /(\b((https?|ftp|file):\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|](\b|$))/ig;
    let urls = [];
    let match;

    while ((match = urlRegex.exec(postContent)) !== null) {
        urls.push(match[0]);
    }
    return urls;
}

const createPost = async (userId, postData) => {
    let postUrls = findUrls(postData.content);
    if (postUrls.length > 0) {
        const isValid = await validateUrls(postUrls);
        if (!isValid) {
            const error = new Error('Post contains blacklisted URL');
            error.code = 400;
            throw error;
        }
    }
    const newPost = new Post({
        author: userId,
        content: postData.content,
        image: postData.image,
    });
    await newPost.save();

    const savedPost = await Post.findById(newPost._id)
        .populate('author', 'name image')
        .exec();

    const obj = savedPost.toObject();
    obj.commentsLength = 0;
    delete obj.comments;

    return obj;
};

const updatePost = async (postId, postData) => {
    let updateData = { ...postData };
    delete updateData._id;
    delete updateData.author;
    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    if (!updatedPost) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
}

const deletePost = async (postId) => {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
}

const likePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
    if (post.likes.includes(userId)) {
        const error = new Error('Post already liked');
        error.code = 400;
        throw error;
    }
    post.likes.push(userId);
    await post.save();
}

const unlikePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
    if (!post.likes.includes(userId)) {
        const error = new Error('Post not liked');
        error.code = 400;
        throw error;
    }
    post.likes.pull(userId);
    await post.save();
}

const validateUrl = async (url) => {
    try {
        const bloomFilterResponse = await urlFilterServices.checkUrl(url);
        return !bloomFilterResponse; // if its true = response containes blacklisted
    } catch (error) {
        console.error(`Error calling URL filter service for ${url}: ${error.message}`);
        return false;
    }
}

const validateUrls = async (urls) => {
    for (const url of urls) {
        const isValid = await validateUrl(url);
        if (!isValid) {
            return false;
        }
        return true;
    }
}

export default {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost
};
