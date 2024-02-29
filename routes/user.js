import express from 'express';
import userController from '../controllers/user.js';
import auth from '../middleware/authenticate.js';

const router = express.Router();
router.route('/')
    .post(userController.registerUser);

router.route('/:id')
    .get(auth.authenticate, userController.getUser)
    .put(auth.authenticate, userController.updateUser)
    .patch(auth.authenticate, userController.patchUser)
    .delete(auth.authenticate, userController.deleteUser);

export default router;