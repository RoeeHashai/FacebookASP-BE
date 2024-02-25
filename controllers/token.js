import tokenServices from '../services/token.js';

const createToken = async (req, res) => {
    try {
        const token = await tokenServices.authenticateUser(req.body);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export default {
    createToken
};