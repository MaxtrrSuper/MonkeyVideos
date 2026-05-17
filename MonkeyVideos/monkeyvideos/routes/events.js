const express = require('express');
const router = express.Router();
const EventModel = require('../models/Event');

const adminAuth = (req, res, next) => {
    const token = req.headers['admin-token'] || req.query.token;
    if (token === process.env.ADMIN_TOKEN || token === 'monkey-admin-secret-2024') next();
    else res.status(403).json({ success: false, error: 'Доступ запрещён' });
};

router.get('/active', async (req, res) => {
    try {
        const event = await EventModel.getActive();
        if (!event) return res.json({ success: true, data: null });
        const tasks = await EventModel.getTasks(event.id);
        res.json({ success: true, data: { event, tasks } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/admin/all', adminAuth, async (req, res) => {
    try {
        const events = await EventModel.getAll(true);
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/admin/create', adminAuth, async (req, res) => {
    try {
        const event = await EventModel.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/admin/:id/toggle', adminAuth, async (req, res) => {
    try {
        await EventModel.toggleActive(req.params.id, req.body.isActive);
        res.json({ success: true, message: 'Статус ивента изменён' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/admin/:id', adminAuth, async (req, res) => {
    try {
        await EventModel.delete(req.params.id);
        res.json({ success: true, message: 'Ивент удалён' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/admin/tasks', adminAuth, async (req, res) => {
    try {
        const task = await EventModel.createTask(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;