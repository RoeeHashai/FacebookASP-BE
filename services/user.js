import User from "../models/user.js";

// To Change: dont need to return the user all of the time. 

const registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email in use.');
    }
    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        image: userData.image,
        friends: []
    });
    await newUser.save();
};

const getUserByEmail = async (req) => {
    const email = req.params.id;
    const user = await User.findOne({ email }).select('email name image ').exec();
    if (!user) {
        throw new Error('User not found.');
    }
    return user;
};

const updateUser = async (req) => {
    const email = req.params.id;
    const userData = req.body;

    const updatedUser = await User.findOneAndUpdate({ email: email }, userData, { new: true }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
    return updatedUser;
}

const patchUser = async (req) => {
    const  email  = req.params.id;
    const userData = req.body;
    const updatedUser = await User.findOneAndUpdate({ email: email }, { $set: userData }, { new: true }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
    return updatedUser;
}

const deleteUser = async (req) => {
    const email = req.params.id;
    const updatedUser = await User.findOneAndDelete({ email: email }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
}

export default {
    registerUser,
    getUserByEmail,
    updateUser,
    patchUser,
    deleteUser
};