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

    targetUser.friends.push({ friendId: new mongoose.Types.ObjectId(userId) });


    await targetUser.save();
    const user = await User.findById(userId).exec();
    user.friends.push({
        friendId: new mongoose.Types.ObjectId(targetUserId),
        status: 's-pending'
    });

    await user.save();
}

const acceptFriend = async (userId, friendId) => {
    // Step 1: Retrieve the accepting user
    const user = await User.findById(userId).exec();
    if (!user) {
        throw new Error('User not found', { code: 404 });
    }

    // Step 2: Approve the friend request for the accepting user
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'friends.friendId': { $eq: friendId } },
        { $set: { 'friends.$.status': 'approved' } },
        { new: true }
    ).exec();
    if (!updatedUser) {
        throw new Error('Friend not found in the accepting user\'s friend list', { code: 404 });
    }

    // Step 3: Add the new friend to the requester user
    const updatedFriend = await User.findByIdAndUpdate(
        friendId,
        { $push: { friends: { friendId: userId, status: 'approved' } } },
        { new: true }
    ).exec();

    if (!updatedFriend) {
        throw new Error('Accepting user not found in the requesting user\'s friend list', { code: 404 });
    }
    const removedSPending = await User.findOneAndUpdate(
        { _id: friendId, 'friends.friendId': userId, 'friends.status': 's-pending' },
        { $pull: { friends: { friendId: userId, status: 's-pending' } } },
        { new: true }
    ).exec();
    if (!removedSPending) {
        throw new Error('s-pending friend request not found for deletion');
    }
};

const deleteFriend = async (userId, friendId) => {
    // Ensure both users exist
    const user = await User.findById(userId).exec();
    const friend = await User.findById(friendId).exec();

    if (!user) {
        throw new Error('User not found', { code: 404 });
    }
    if (!friend) {
        throw new Error('Friend not found', { code: 404 });
    }

    // Remove the friend from the initiating user's friends list
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: { friendId: friendId } } },
        { new: true }
    ).exec();

    if (!updatedUser) {
        throw new Error('Failed to update user', { code: 500 });
    }

    // Remove the initiating user from the friend's friends list
    const updatedFriend = await User.findOneAndUpdate(
        { _id: friendId },
        { $pull: { friends: { friendId: userId } } },
        { new: true }
    ).exec();

    if (!updatedFriend) {
        throw new Error('Failed to update friend', { code: 500 });
    }
};


export default {
    getFriends,
    addFriend,
    acceptFriend,
    deleteFriend
}; 