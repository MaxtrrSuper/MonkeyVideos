const express = require('express');
const router = express.Router({ mergeParams: true });
const CommentModel = require('../models/Comment');

router.get('/', async (req, res) => {
    try {
        const comments = await CommentModel.getByVideoId(req.params.videoId);
        res.json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const comment = await CommentModel.create(req.params.videoId, req.body);
        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await CommentModel.delete(req.params.id);
        res.json({ success: true, message: 'Комментарий удалён' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;