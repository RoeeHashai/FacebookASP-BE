import express from 'express';
import tokenController from '../controllers/token.js';

const router = express.Router();

router.route('/')
    .post(tokenController.createToken);

export default router;