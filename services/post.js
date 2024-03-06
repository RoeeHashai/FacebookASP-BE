import Post from "../models/post.js";

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

const createPost = async (userId, postData) => {
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
    let updateData = {...postData};
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
    
export default { 
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost
};
