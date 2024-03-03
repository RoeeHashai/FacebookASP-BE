import express from 'express';
import tokenRouter from './token.js';
import feedRouter from './feed.js';
import userRouter from './user.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/tokens', tokenRouter);
router.use('/posts', feedRouter);

export default router;