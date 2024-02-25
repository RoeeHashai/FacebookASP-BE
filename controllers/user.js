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
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userServices.getUserByEmail(req);
        res.status(200).json(user);
    }
    catch (error) {
        if (error.message === 'User not found.') {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

const updateUser = async (req, res) => {
    try {
        await userServices.updateUser(req);
        res.status(200).json({ message: 'User updated successfully.' });
    }
    catch (error) {
        if (error.message === 'User not found.') {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

const patchUser = async (req, res) => {
    try {
        await userServices.patchUser(req);
        res.status(200).json({ message: 'User updated successfully.' });
    }
    catch (error) {
        if (error.message === 'User not found.') {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

const deleteUser = async (req, res) => {
    try {
        await userServices.deleteUser(req);
        res.status(200).json({ message: 'User deleted successfully.' });
    }
    catch (error) {
        if (error.message === 'User not found.') {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

export default {
    registerUser,
    getUser,
    updateUser,
    patchUser,
    deleteUser
};
