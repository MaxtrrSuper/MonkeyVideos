const express = require('express');
const router = express.Router();
const { runQuery, getRow } = require('../database/db');

router.post('/register', async (req, res) => {
    try {
        const { username, password, avatar } = req.body;
        
        const existing = await getRow('SELECT id FROM users WHERE username = ?', [username]);
        if (existing) {
            return res.status(409).json({ success: false, error: 'Пользователь уже существует' });
        }

        await runQuery(
            'INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)',
            [username, password, avatar || '🐵']
        );

        res.status(201).json({ success: true, message: 'Регистрация успешна!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await getRow(
            'SELECT id, username, avatar, bio, is_verified, special_badge FROM users WHERE username = ? AND password = ?',
            [req.body.username, req.body.password]
        );

        if (!user) {
            return res.status(401).json({ success: false, error: 'Неверный логин или пароль' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;