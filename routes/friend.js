import express from 'express';
import friendsController from '../controllers/friend.js';
import auth from '../middleware/authenticate.js';
import friendAuth from '../middleware/friendAuth.js';

const router = express.Router({ mergeParams: true });
router.route('/')
    .get(auth.authenticate, friendAuth.verifyUserOrFriend, friendsController.getFriends)
    .post(auth.authenticate, friendsController.addFriend);

router.route('/:fid')
    .patch(auth.authenticate, friendAuth.verifyUser, friendsController.acceptFriend)
    .delete(auth.authenticate, friendAuth.verifyUser, friendsController.deleteFriend);
export default router;