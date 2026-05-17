const express = require('express');
const router = express.Router({ mergeParams: true });
const LikeModel = require('../models/Like');

router.post('/', async (req, res) => {
    try {
        const userId = req.body.userId || req.ip || 'anonymous';
        const result = await LikeModel.toggle(req.params.videoId, userId);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const count = await LikeModel.getCount(req.params.videoId);
        res.json({ success: true, data: { likes: count } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;