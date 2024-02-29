import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

const verifyReqUserIsUser = async (req, res, next) => {
    const requestedUser = req.params.id;
    const userId = req.user.id;
    if (requestedUser === userId) {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
}

export default {
    authenticate, 
    verifyReqUserIsUser
};
