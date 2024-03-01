import feedService from '../services/feed.js';

const getFeed = async (req, res) => {
    try {
        const feed = await feedService.getFeed(req.user.id);
        return res.status(200).json(feed);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

export default {
    getFeed
};

