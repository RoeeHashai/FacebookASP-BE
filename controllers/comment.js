import commentsService from '../services/comment.js';

const getComments = async (req, res) => {
    const postId = req.params.pid;
    try {
        const comments = await commentsService.getComments(postId);
        return res.status(200).json(comments);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const createComment = async (req, res) => {
    try {
        const newComment = await commentsService.createComment(req.user.id, req.params.pid, req.body);
        return res.status(201).json(newComment);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const updateComment = async (req, res) => {
    try {
        await commentsService.updateComment(req.params.pid, req.params.cid, req.body);
        return res.status(200).json({ message: 'Comment updated' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        await commentsService.deleteComment(req.params.pid, req.params.cid);
        return res.status(204).json({ message: 'Comment deleted' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

export default {
    getComments,
    createComment,
    updateComment,
    deleteComment
};