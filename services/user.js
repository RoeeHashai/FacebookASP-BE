import User from "../models/user.js";

const registerUser = async (userData) => {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email in use.');
    }

    // Create a new user
    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        image: userData.image,
        friends: []
    });

    // Save the new user to the database
    await newUser.save();
};

// const loginUser = async (userData) => {
//     // Check if the email exists in the database
//     const existingUser = await User.findOne({ email: userData.email });
//     if (!existingUser) {
//         throw new Error('User not found.');
//     }
//     else if (existingUser.password !== userData.password) {
//         throw new Error('Invalid password.');
//     }
//     return existingUser;

// };

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email }).exec();
    if (!user) {
        throw new Error('User not found.');
    }
    return user;
};

export default {
    registerUser,
    getUserByEmail
};