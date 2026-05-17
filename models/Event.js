const { runQuery, getRow, getAllRows } = require('../database/db');

class EventModel {
    static async getAll(includeInactive = false) {
        let query = 'SELECT * FROM events';
        if (!includeInactive) query += ' WHERE is_active = 1';
        query += ' ORDER BY created_at DESC';
        return await getAllRows(query);
    }

    static async getActive() {
        return await getRow('SELECT * FROM events WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1');
    }

    static async create(data) {
        const { title, description, emoji, reward_title, starts_at, ends_at } = data;
        const result = await runQuery(
            'INSERT INTO events (title, description, emoji, reward_title, starts_at, ends_at) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, emoji || '🎉', reward_title || 'Участник', starts_at, ends_at]
        );
        return { id: result.lastID, ...data };
    }

    static async toggleActive(id, isActive) {
        await runQuery('UPDATE events SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
    }

    static async delete(id) {
        await runQuery('DELETE FROM events WHERE id = ?', [id]);
    }

    static async getTasks(eventId) {
        return await getAllRows('SELECT * FROM event_tasks WHERE event_id = ?', [eventId]);
    }

    static async createTask(data) {
        const { event_id, title, description, type, target_count, reward_xp } = data;
        const result = await runQuery(
            'INSERT INTO event_tasks (event_id, title, description, type, target_count, reward_xp) VALUES (?, ?, ?, ?, ?, ?)',
            [event_id, title, description, type, target_count, reward_xp || 100]
        );
        return { id: result.lastID, ...data };
    }
}

module.exports = EventModel;