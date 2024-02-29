import express from 'express';
import postController from '../controllers/post.js';
import auth from '../middleware/authenticate.js';
import friendAuth from '../middleware/friendAuth.js';

const router = express.Router({ mergeParams: true });
router.route('/')
    .get(auth.authenticate, friendAuth.verifyUserOrFriend, postController.getPosts)
    .post(auth.authenticate, auth.verifyReqUserIsUser, postController.createPost);

router.route('/:pid')
    .patch(auth.authenticate, auth.verifyReqUserIsUser, postController.updatePost)
    .delete(auth.authenticate, auth.verifyReqUserIsUser, postController.deletePost);

export default router;