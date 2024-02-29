import User from "../models/user.js";

const createNewUser = async (userData) => {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email in use.');
    }

    // Create a new user
    const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        image: userData.image,
        friends: []
    });

    // Save the new user to the database
    await user.save();
};

export default {
    createNewUser
};