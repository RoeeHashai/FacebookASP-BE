import User from '../models/user.js';
import mongoose from 'mongoose';

const getFriends = async (targetUserId) => {
    const userWithFriends = await User.findById(targetUserId)
        .populate('friends.friendId', '_id name image')
        .exec();

    const friendsList = userWithFriends.friends.map(friend => {
        return {
            _id: friend.friendId._id,
            name: friend.friendId.name,
            image: friend.friendId.image,
            status: friend.status
        };
    })

    return friendsList;
};

const addFriend = async (userId, targetUserId) => {
    const targetUser = await User.findById(targetUserId).exec();
    if (!targetUser) {
        const error = new Error('User not found');
        error.code = 404;
        throw error;
    }

    const isFriend = targetUser.friends.find(friend => friend.friendId.toString() === userId);
    if (isFriend) {
        const error = new Error('User already a friend');
        error.code = 400;
        throw error;
    }

    targetUser.friends.push({ friendId: new mongoose.Types.ObjectId(userId) }); // Assuming 'pending' status

    await targetUser.save();
}

const acceptFriend = async (userId, friendId) => {
    const user = await User.findById(userId).exec();
    if (!user) {
        const error = new Error('User not found');
        error.code = 404;
        throw error;
    }
    const updatedUser = await User.findOneAndUpdate({ _id: userId, 'friends.friendId': friendId }, { $set: { 'friends.$.status': 'approved' } }, { new: true }).exec();
    if (!updatedUser) {
        const error = new Error('Friend not found');
        error.code = 404;
        throw error;
    }
}

const deleteFriend = async (userId, friendId) => {
    const user = await User.findById(userId).exec();
    if(!user) {
        const error = new Error('User not found');
        error.code = 404;
        throw error;
    }
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $pull: { friends: { friendId } } }, { new: true }).exec();
    if (!updatedUser) {
        const error = new Error('Friend not found');
        error.code = 404;
        throw error;
    }
}


export default {
    getFriends,
    addFriend,
    acceptFriend,
    deleteFriend
}; 