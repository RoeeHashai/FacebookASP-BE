import Post from '../models/post.js';
import User from '../models/user.js';
import mongoose from "mongoose";

const getFeed = async (userId) => {
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Find the user to get their list of friends
    const user = await User.findById(objectIdUserId);
    if (!user) {
        throw new Error('User not found');
    }

    // Extracting friendIds from the friends array
    const friends = user.friends.map(friend => friend.friendId);

    // Fetch 20 posts from friends, 3 posts from the user, and 5 posts from non-friends
    let friendsPosts = await Post.find({ author: { $in: friends } })
        .populate('author', 'name image')
        .sort({ date: -1 })
        .limit(20)
        .exec();
    
    let userPosts = await Post.find({ author: objectIdUserId })
        .populate('author', 'name image')
        .sort({ date: -1 })
        .limit(3)
        .exec();
    
    let nonFriendsPosts = await Post.find({
        author: { $ne: objectIdUserId, $nin: friends }
    })
    .populate('author', 'name image')
    .sort({ date: -1 })
    .limit(5)
    .exec();

    // Combine all fetched posts into a single array
    let combinedPosts = [...friendsPosts, ...userPosts, ...nonFriendsPosts];

    // Map through each post to add commentsLength
    combinedPosts = combinedPosts.map(post => {
        const obj = post.toObject();
        obj.commentsLength = obj.comments ? obj.comments.length : 0;
        delete obj.comments;
        return obj;
    });

    // Sort combinedPosts by date in descending order (newest first)
    combinedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return combinedPosts;
};

export default {
    getFeed
};
