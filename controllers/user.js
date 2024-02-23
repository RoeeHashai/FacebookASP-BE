import userServices from '../services/user.js';

const createNewUser = async (req, res) => {
    try {
        await userServices.createNewUser(req.body);
        res.status(201).json({ message: 'User created successfully.' });
    }
    catch (error) {
        if (error.message === 'Email in use.') {
            res.status(400).json({ message: error.message });
        } else {
            // Generic error handling for unexpected issues
            console.error(error);  // Logging the error for debugging
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};
export default { createNewUser };
