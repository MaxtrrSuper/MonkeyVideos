const express = require('express');
const router = express.Router();
const path = require('path');
const VideoModel = require('../models/Video');
const { upload, handleUploadErrors } = require('../middleware/upload');

router.get('/', async (req, res) => {
    try {
        const videos = await VideoModel.getAll();
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const videos = await VideoModel.search(req.query.q || '');
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/popular', async (req, res) => {
    try {
        const videos = await VideoModel.getPopular();
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/my', async (req, res) => {
    try {
        const videos = await VideoModel.getByUser(req.query.user || 'anonymous');
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/upload', (req, res, next) => {
    upload.single('video')(req, res, (err) => {
        if (err) return handleUploadErrors(err, req, res, next);
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'Файл не загружен' });
        
        const videoUrl = `/uploads/videos/${req.file.filename}`;
        const video = await VideoModel.create({
            url: videoUrl,
            title: req.body.title || 'Моё видео',
            description: req.body.description || '',
            user: req.body.user || 'anonymous',
            avatar: req.body.avatar || '🎥',
            isUploaded: true,
            originalName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });

        res.status(201).json({ success: true, data: video });
    } catch (error) {
        if (req.file) {
            try { require('fs').unlinkSync(req.file.path); } catch(e) {}
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const video = await VideoModel.create(req.body);
        res.status(201).json({ success: true, data: video });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await VideoModel.delete(req.params.id);
        res.json({ success: true, message: 'Видео удалено' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;