import postServices from '../services/post.js';

const getPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const posts = await postServices.getPosts(userId);
        return res.status(200).json(posts);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const createPost = async (req, res) => {
    const userId = req.user.id;
    try {
        const newPost = await postServices.createPost(userId, req.body);
        return res.status(201).json(newPost);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const updatePost = async (req, res) => {
    try {
        await postServices.updatePost(req.params.pid, req.body);
        return res.status(200).json({ message: 'Post updated' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const deletePost = async (req, res) => {
    const userId = req.user.id;
    try {
        await postServices.deletePost(req.params.pid);
        return res.status(204).end();
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

export default {
    getPosts,
    createPost,
    updatePost,
    deletePost
};