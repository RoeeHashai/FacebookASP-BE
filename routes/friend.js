import express from 'express';
import friendsController from '../controllers/friend.js';
import auth from '../middleware/authenticate.js';
import friendAuth from '../middleware/friendAuth.js';

const router = express.Router({ mergeParams: true });
router.route('/')
    .get(auth.authenticate, friendAuth.verifyUserOrFriend, friendsController.getFriends)
    .post(auth.authenticate, friendsController.addFriend);

router.route('/:fid')
    .patch(auth.authenticate, auth.verifyReqUserIsUser, friendsController.acceptFriend)
    .delete(auth.authenticate, auth.verifyReqUserIsUser, friendsController.deleteFriend);
export default router;