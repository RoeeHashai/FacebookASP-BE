import User from "../models/user.js";
import Post from "../models/post.js";
import mongoose from 'mongoose';

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

const validateUserData = async (userData, isUpdate = false) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const base64ImagePattern = /^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;


    if (userData.email && !emailPattern.test(userData.email)) {
        throw new Error('Invalid email format.');
    }

    if (userData.password && !passwordPattern.test(userData.password)) {
        throw new Error('Password must be at least 8 characters long and contain both numbers and letters.');
    }

    // For registration and unique email check during update
    if (!isUpdate || userData.email) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email in use.');
        }
    }

    // Updated image file type validation for base64 strings
    if (userData.image && !base64ImagePattern.test(userData.image)) {
        throw new Error('Unsupported or invalid base64 image. Allowed types are .jpg, .jpeg, .png.');
    }
};

const registerUser = async (userData) => {
    await validateUserData(userData);

    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        image: userData.image,
        friends: []
    });

    await newUser.save();
};

const updateUser = async (req) => {
    const _id = req.params.id;
    const updateData = req.body;
    delete updateData._id;
    const userData = { ...updateData };

    await validateUserData(userData, true);

    const updatedUser = await User.findOneAndUpdate({ _id }, userData, { new: true }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
    return updatedUser;
};

const patchUser = async (req) => {
    const _id = req.params.id;
    const updateData = req.body;
    delete updateData._id;
    const userData = { ...updateData };

    await validateUserData(userData, true);

    const updatedUser = await User.findOneAndUpdate({ _id }, { $set: userData }, { new: true }).exec();
    if (!updatedUser) {
        throw new Error('User not found.');
    }
    return updatedUser;
};

const deleteUser = async (req) => {
    const _id = req.params.id;
    const deletedUser = await User.findOneAndDelete({ _id }).exec();
    if (!deletedUser) {
        throw new Error('User not found.');
    }
    await Post.deleteOne({ author: _id }).exec();
};

export default {
    registerUser,
    getUserByEmailOrId,
    updateUser,
    patchUser,
    deleteUser
};