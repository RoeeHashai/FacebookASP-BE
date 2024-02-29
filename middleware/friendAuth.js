import User from '../models/user.js';
const verifyUserOrFriend = async (req, res, next) => {
    const targetId = req.params.id;
    const userId = req.user.id;
    try {
        if (targetId === userId || await isUserFriend(userId, targetId)) {
            next();
        }
        else {
            res.status(401).json({ message: 'Unauthorized access' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const isUserFriend = async (userId, targetId) => {
    try {
        const targerUser = await User.findById(targetId).exec();
        if (!targerUser) {
            const error = new Error('User not found');
            error.code = 404;
            throw error;
        }

        const isFriend = targerUser.friends.find(friend => friend.friendId.toString() === userId);
        return isFriend;
    } catch (error) {
        throw new Error(error.message);
    }
}



export default {
    verifyUserOrFriend,
};