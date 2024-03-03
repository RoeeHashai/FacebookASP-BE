import Post from "../models/post.js";

const getPosts = async (userId) => {
    let posts = await Post.find({ author: userId })
        .populate('author', 'name image')
        .sort({ date: -1 })
        .exec();

    // Map through each post and add a commentsLength property
    posts = posts.map(post => {
        const obj = post.toObject(); // Convert the Mongoose document to a plain JavaScript object
        obj.commentsLength = post.comments.length; // Add commentsLength property
        delete obj.comments; // Optionally remove the comments array if not needed
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
    return savedPost;
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
    
export default { 
    getPosts,
    createPost,
    updatePost,
    deletePost
};
