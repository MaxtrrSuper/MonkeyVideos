const { runQuery, getRow, getAllRows } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

class VideoModel {
    static async getAll(limit = 20, offset = 0) {
        return await getAllRows(
            'SELECT * FROM videos ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
    }

    static async getById(id) {
        return await getRow('SELECT * FROM videos WHERE id = ?', [id]);
    }

    static async create(data) {
        const { url, title, description, user, avatar, isUploaded, originalName, fileSize, mimeType } = data;
        const uuid = uuidv4();
        
        const result = await runQuery(
            `INSERT INTO videos (uuid, url, title, description, user, avatar, is_uploaded, original_name, file_size, mime_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [uuid, url, title || '', description || '', user, avatar || '🐵', isUploaded ? 1 : 0, originalName, fileSize, mimeType]
        );
        
        return { id: result.lastID, uuid, ...data };
    }

    static async incrementViews(id) {
        await runQuery('UPDATE videos SET views = views + 1 WHERE id = ?', [id]);
    }

    static async search(query) {
        return await getAllRows(
            'SELECT * FROM videos WHERE title LIKE ? OR description LIKE ? OR user LIKE ? ORDER BY likes DESC LIMIT 50',
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );
    }

    static async getPopular(limit = 10) {
        return await getAllRows('SELECT * FROM videos ORDER BY likes DESC LIMIT ?', [limit]);
    }

    static async getByUser(username) {
        return await getAllRows('SELECT * FROM videos WHERE user = ? ORDER BY created_at DESC', [username]);
    }

    static async delete(id) {
        await runQuery('DELETE FROM videos WHERE id = ?', [id]);
    }
}

module.exports = VideoModel;