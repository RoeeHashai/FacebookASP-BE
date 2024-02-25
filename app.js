import express from 'express';
import customEnv from 'custom-env';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import userRouter from './routes/user.js';
import tokenRouter from './routes/token.js';
import cors from 'cors';
const server = express();

server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
server.use(express.static('public'));
server.use(express.json());
server.use(cors());

customEnv.env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, {});

server.use('/api/users', userRouter);
server.use('/api/tokens', tokenRouter);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
