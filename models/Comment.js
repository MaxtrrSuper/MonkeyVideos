const { runQuery, getAllRows } = require('../database/db');

class CommentModel {
    static async getByVideoId(videoId) {
        return await getAllRows(
            'SELECT * FROM comments WHERE video_id = ? ORDER BY created_at DESC LIMIT 50',
            [videoId]
        );
    }

    static async create(videoId, data) {
        const { text, user } = data;
        const result = await runQuery(
            'INSERT INTO comments (video_id, user, text) VALUES (?, ?, ?)',
            [videoId, user, text]
        );
        return { id: result.lastID, video_id: videoId, user, text };
    }

    static async delete(id) {
        await runQuery('DELETE FROM comments WHERE id = ?', [id]);
    }
}

module.exports = CommentModel;