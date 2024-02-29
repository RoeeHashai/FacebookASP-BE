import User from "../models/user.js";
import mongoose from 'mongoose';

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

const getUserByEmailOrId = async (req) => {
    const param = req.params.id;
    let queryConditions = [{ email: param }];
    
    // Check if param is a valid ObjectId before adding it to the query conditions
    if (mongoose.Types.ObjectId.isValid(param)) {
        queryConditions.push({ _id: param });
    }

    const user = await User.findOne({ $or: queryConditions }).select('_id email name image').exec();
    if (!user) {
        throw new Error('User not found.');
    }
    return user;
};

const updateUser = async (req) => {
    const _id = req.params.id;
    const userData = req.body;

    const updatedUser = await User.findOneAndUpdate({ _id }, userData, { new: true }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
    return updatedUser;
}

const patchUser = async (req) => {
    const _id = req.params.id;
    const userData = req.body;
    const updatedUser = await User.findOneAndUpdate({ _id }, { $set: userData }, { new: true }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
    return updatedUser;
}

const deleteUser = async (req) => {
    const _id = req.params.id;
    const updatedUser = await User.findOneAndDelete({ _id }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
}

export default {
    registerUser,
    getUserByEmailOrId,
    updateUser,
    patchUser,
    deleteUser
};