import express from 'express';
import userController from '../controllers/user.js';
import auth from '../middleware/authenticate.js';

const router = express.Router();
router.route('/')
    .post(userController.registerUser);

router.route('/:id')
    .get(auth.authenticate, userController.getUser);

export default router;