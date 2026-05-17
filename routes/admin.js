const express = require('express');
const router = express.Router();
const { getAllRows, getRow, runQuery } = require('../database/db');
const fs = require('fs');
const path = require('path');

const adminAuth = (req, res, next) => {
    const token = req.headers['admin-token'] || req.query.token;
    if (token === process.env.ADMIN_TOKEN || token === 'monkey-admin-secret-2024') {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Доступ запрещён' });
    }
};

router.get('/stats', adminAuth, async (req, res) => {
    try {
        const stats = {
            totalVideos: await getRow('SELECT COUNT(*) as count FROM videos'),
            totalUsers: await getRow('SELECT COUNT(*) as count FROM users'),
            totalLikes: await getRow('SELECT SUM(likes) as count FROM videos'),
            totalComments: await getRow('SELECT COUNT(*) as count FROM comments'),
            totalViews: await getRow('SELECT SUM(views) as count FROM videos'),
            verifiedUsers: await getRow('SELECT COUNT(*) as count FROM users WHERE is_verified = 1'),
            topVideos: await getAllRows('SELECT * FROM videos ORDER BY likes DESC LIMIT 5'),
            topUsers: await getAllRows('SELECT user as username, COUNT(*) as video_count, SUM(likes) as total_likes FROM videos GROUP BY user ORDER BY total_likes DESC LIMIT 5')
        };
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await getAllRows(`
            SELECT u.*, 
                   (SELECT COUNT(*) FROM videos WHERE user = u.username) as video_count,
                   (SELECT SUM(likes) FROM videos WHERE user = u.username) as total_likes
            FROM users u ORDER BY u.created_at DESC
        `);
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/users/:id/verify', adminAuth, async (req, res) => {
    try {
        await runQuery('UPDATE users SET is_verified = 1, verified_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: '✅ Верификация выдана' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/users/:id/unverify', adminAuth, async (req, res) => {
    try {
        await runQuery('UPDATE users SET is_verified = 0 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Верификация снята' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/users/:id', adminAuth, async (req, res) => {
    try {
        const { username, avatar, bio, is_verified, special_badge } = req.body;
        await runQuery(
            `UPDATE users SET 
                username = COALESCE(?, username),
                avatar = COALESCE(?, avatar),
                bio = COALESCE(?, bio),
                is_verified = COALESCE(?, is_verified),
                special_badge = COALESCE(?, special_badge)
             WHERE id = ?`,
            [username, avatar, bio, is_verified, special_badge, req.params.id]
        );
        res.json({ success: true, message: 'Профиль обновлён' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/users/:id/ban', adminAuth, async (req, res) => {
    try {
        await runQuery('UPDATE users SET is_banned = 1, ban_reason = ? WHERE id = ?', [req.body.reason || 'Нарушение', req.params.id]);
        res.json({ success: true, message: 'Пользователь забанен' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/users/:id/unban', adminAuth, async (req, res) => {
    try {
        await runQuery('UPDATE users SET is_banned = 0, ban_reason = NULL WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Пользователь разбанен' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/videos/:id/pin', adminAuth, async (req, res) => {
    try {
        await runQuery('UPDATE videos SET is_pinned = 0');
        await runQuery('UPDATE videos SET is_pinned = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Видео закреплено' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/videos/:id', adminAuth, async (req, res) => {
    try {
        const video = await getRow('SELECT * FROM videos WHERE id = ?', [req.params.id]);
        if (video && video.is_uploaded) {
            const filePath = path.join(__dirname, '..', video.url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await runQuery('DELETE FROM videos WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Видео удалено' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/reset', adminAuth, async (req, res) => {
    try {
        await runQuery('DELETE FROM user_tasks');
        await runQuery('DELETE FROM event_tasks');
        await runQuery('DELETE FROM events');
        await runQuery('DELETE FROM likes');
        await runQuery('DELETE FROM comments');
        await runQuery('DELETE FROM videos');
        await runQuery('DELETE FROM users');
        
        const uploadsDir = path.join(__dirname, '..', 'uploads', 'videos');
        if (fs.existsSync(uploadsDir)) {
            fs.readdirSync(uploadsDir).forEach(file => {
                try { fs.unlinkSync(path.join(uploadsDir, file)); } catch(e) {}
            });
        }
        
        res.json({ success: true, message: 'Все данные очищены' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;