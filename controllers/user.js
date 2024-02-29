import userServices from '../services/user.js';

const registerUser = async (req, res) => {
    try {
        await userServices.registerUser(req.body);
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

const getUser = async (req, res) => {
    try {
        const email = req.params.id;
        const user = await userServices.getUserByEmail(email);
        res.status(200).json(user);
    }
    catch (error) {
        if (error.message === 'User not found.') {
            res.status(404).json({ message: error.message });
        } else {
            // Generic error handling for unexpected issues
            console.error(error);  // Logging the error for debugging
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default {
    registerUser,
    getUser
};
