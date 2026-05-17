const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Путь к базе данных (работает и локально и на Railway)
const dbPath = process.env.RAILWAY_VOLUME_MOUNT_PATH 
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'monkeyvideos.db')
    : path.resolve(__dirname, '..', 'monkeyvideos.db');

// Создаём подключение
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к базе:', err.message);
        process.exit(1);
    }
    console.log('🗄️  База данных:', dbPath);
});

// Включаем внешние ключи
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA journal_mode = WAL');

// Функции для запросов
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function getRow(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getAllRows(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// Инициализация таблиц
async function initializeDatabase() {
    const schema = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            avatar TEXT DEFAULT '🐵',
            bio TEXT DEFAULT '',
            is_verified INTEGER DEFAULT 0,
            is_banned INTEGER DEFAULT 0,
            ban_reason TEXT,
            special_badge TEXT,
            verified_at DATETIME,
            banned_at DATETIME,
            followers_count INTEGER DEFAULT 0,
            following_count INTEGER DEFAULT 0,
            xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE NOT NULL,
            url TEXT NOT NULL,
            title TEXT DEFAULT '',
            description TEXT DEFAULT '',
            user TEXT NOT NULL,
            avatar TEXT DEFAULT '🐵',
            likes INTEGER DEFAULT 0,
            views INTEGER DEFAULT 0,
            shares INTEGER DEFAULT 0,
            is_uploaded INTEGER DEFAULT 0,
            is_pinned INTEGER DEFAULT 0,
            original_name TEXT,
            file_size INTEGER,
            mime_type TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER NOT NULL,
            user TEXT NOT NULL,
            text TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER NOT NULL,
            user_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(video_id, user_id),
            FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            emoji TEXT DEFAULT '🎉',
            reward_title TEXT DEFAULT 'Участник',
            is_active INTEGER DEFAULT 0,
            starts_at DATETIME,
            ends_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS event_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            type TEXT DEFAULT 'likes',
            target_count INTEGER DEFAULT 10,
            reward_xp INTEGER DEFAULT 100,
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS user_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            task_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            progress INTEGER DEFAULT 0,
            target_count INTEGER DEFAULT 10,
            completed INTEGER DEFAULT 0,
            completed_at DATETIME,
            FOREIGN KEY (task_id) REFERENCES event_tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_videos_user ON videos(user);
        CREATE INDEX IF NOT EXISTS idx_videos_created ON videos(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_videos_pinned ON videos(is_pinned);
        CREATE INDEX IF NOT EXISTS idx_comments_video ON comments(video_id);
        CREATE INDEX IF NOT EXISTS idx_likes_video ON likes(video_id);
        CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
        CREATE INDEX IF NOT EXISTS idx_users_verified ON users(is_verified);
    `;

    try {
        const statements = schema.split(';').filter(s => s.trim());
        for (let statement of statements) {
            if (statement.trim()) {
                await runQuery(statement);
            }
        }
        console.log('✅ База данных готова');
        
        // Тестовые данные
        await seedDatabase();
    } catch (error) {
        console.error('❌ Ошибка инициализации:', error.message);
    }
}

async function seedDatabase() {
    const count = await getRow('SELECT COUNT(*) as count FROM videos');
    if (count.count === 0) {
        console.log('🌱 Добавляю тестовые видео...');
        const testVideos = [
            ['https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4', 'Банановый рай', '@banana_king', '🦍', 'Когда нашёл идеальный банан 🍌', 45200],
            ['https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4', 'Утро в джунглях', '@jungle_vibes', '🐒', 'Звуки природы 🌴', 28700],
            ['https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4', 'Кокосовый челлендж', '@coconut_crazy', '🦧', 'Райский пляж 🥥', 63100]
        ];
        
        for (let v of testVideos) {
            await runQuery(
                `INSERT INTO videos (uuid, url, title, user, avatar, description, likes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [require('uuid').v4(), v[0], v[1], v[2], v[3], v[4], v[5]]
            );
        }
        console.log('✅ Тестовые видео добавлены');
    }
}

// Закрытие при выходе
process.on('SIGINT', () => {
    db.close(() => {
        console.log('🔒 База закрыта');
        process.exit(0);
    });
});

module.exports = { db, runQuery, getRow, getAllRows, initializeDatabase };