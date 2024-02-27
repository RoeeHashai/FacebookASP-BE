import friendServices from '../services/friend.js';
const getFriends = async (req, res) => {
    const targetUserId = req.params.id;
    try {
        const friendsList = await friendServices.getFriends(targetUserId);
        console.log(friendsList);
        return res.status(200).json({ friends: friendsList });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

const addFriend = async (req, res) => {
    const targerUserId = req.params.id;
    const userId = req.user.id;
    try {
        await friendServices.addFriend(userId, targerUserId);
        return res.status(201).json({ message: 'Friend request sent' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const acceptFriend = async (req, res) => {
    const userId = req.user.id;
    const friendId = req.params.fid;
    try {
        await friendServices.acceptFriend(userId, friendId);
        return res.status(200).json({ message: 'Friend request accepted' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const deleteFriend = async (req, res) => {
    const userId = req.user.id;
    const friendId = req.params.fid;
    try {
        await friendServices.deleteFriend(userId, friendId);
        return res.status(200).json({ message: 'Friend deleted' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    
    }
}

export default {
    getFriends,
    addFriend, 
    acceptFriend, 
    deleteFriend
};