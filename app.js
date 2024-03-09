import express from 'express';
import customEnv from 'custom-env';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api.js';
import cors from 'cors';
import path from 'path';

const server = express();

server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
server.use(express.static('public'));
server.use(express.json());
server.use(cors());

customEnv.env(process.env.NODE_ENV, './config');
mongoose.connect(process.env.CONNECTION_STRING, {});

server.use('/api', apiRoutes);

server.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
