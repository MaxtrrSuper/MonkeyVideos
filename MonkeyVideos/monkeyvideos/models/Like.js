const { runQuery, getRow } = require('../database/db');

class LikeModel {
    static async toggle(videoId, userId) {
        const existing = await getRow(
            'SELECT * FROM likes WHERE video_id = ? AND user_id = ?',
            [videoId, userId]
        );

        if (existing) {
            await runQuery('DELETE FROM likes WHERE id = ?', [existing.id]);
        } else {
            await runQuery('INSERT INTO likes (video_id, user_id) VALUES (?, ?)', [videoId, userId]);
        }

        const count = await getRow('SELECT COUNT(*) as count FROM likes WHERE video_id = ?', [videoId]);
        return { liked: !existing, likes: count.count };
    }

    static async getCount(videoId) {
        const row = await getRow('SELECT COUNT(*) as count FROM likes WHERE video_id = ?', [videoId]);
        return row.count;
    }
}

module.exports = LikeModel;