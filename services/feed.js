import Post from '../models/post.js';
import User from '../models/user.js';
import mongoose from "mongoose";

const getFeed = async (userId) => {
    const objectIdUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

    const user = await User.findById(objectIdUserId);
    if (!user) throw new Error('User not found');

    const friends = user.friends.map(friend => friend.friendId);

    const queryConditions = [
        { author: { $in: friends } }, // Posts from friends
        { author: objectIdUserId }, // User's own posts
        { // Posts from non-friends
            author: { $ne: objectIdUserId, $nin: friends }
        }
    ];

    const feedPromises = queryConditions.map(condition => 
        Post.find(condition)
            .sort({ date: -1 })
            .populate('author', 'name image')
            .limit(condition.author === objectIdUserId ? 3 : 5) // Limit for user's own posts and non-friends
    );

    // Fetch all posts based on the conditions and merge into a single array
    let combinedPosts = (await Promise.all(feedPromises)).flat();

    // Sort combined posts by date
    combinedPosts.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Map through each post to adjust the structure
    const feed = combinedPosts.map(post => {
        const obj = post.toObject(); // Convert to plain JavaScript object
        obj.commentsLength = post.comments.length; // Add commentsLength property
        delete obj.comments; // Remove the comments array
        return obj;
    });

    return feed;
};

export default {
    getFeed
};
