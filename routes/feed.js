import express from 'express';
import feedController from '../controllers/feed.js';
import auth from '../middleware/authenticate.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(auth.authenticate, feedController.getFeed)

export default router;
