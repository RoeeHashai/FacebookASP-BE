import express from 'express';
import customEnv from 'custom-env';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import userRouter from './routes/user.js';
const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(express.json());

customEnv.env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, {});

server.use('/api/users', userRouter);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
