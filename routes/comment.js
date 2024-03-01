import express from 'express';
import commentController from '../controllers/comment.js';
import auth from '../middleware/authenticate.js';

const router = express.Router({ mergeParams: true });
router.route('/')
    .get(auth.authenticate, commentController.getComments)
    .post(auth.authenticate, auth.verifyReqUserIsUser, commentController.createComment);

router.route('/:cid')
    .patch(auth.authenticate, auth.verifyReqUserIsUser, commentController.updateComment)
    .delete(auth.authenticate, auth.verifyReqUserIsUser, commentController.deleteComment);

export default router;