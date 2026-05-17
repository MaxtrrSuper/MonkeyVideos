const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// База данных
const db = new sqlite3.Database('./monkeyvideos.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE,
        url TEXT NOT NULL,
        title TEXT DEFAULT '',
        description TEXT DEFAULT '',
        user TEXT NOT NULL,
        avatar TEXT DEFAULT '🐵',
        likes INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        is_uploaded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id INTEGER,
        user TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id INTEGER,
        user_id TEXT,
        UNIQUE(video_id, user_id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        emoji TEXT DEFAULT '🎉',
        is_active INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS event_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER,
        title TEXT NOT NULL,
        type TEXT DEFAULT 'likes',
        target_count INTEGER DEFAULT 10,
        reward_xp INTEGER DEFAULT 100
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT '🐵',
        is_verified INTEGER DEFAULT 0,
        is_banned INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Загрузка файлов
const uploadDir = './uploads/videos';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Главная
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Получить видео
app.get('/api/videos', (req, res) => {
    db.all('SELECT * FROM videos ORDER BY created_at DESC LIMIT 20', (err, rows) => {
        res.json({ success: true, data: rows || [] });
    });
});

// API: Загрузить видео
app.post('/api/videos/upload', upload.single('video'), (req, res) => {
    if (!req.file) return res.json({ success: false, error: 'Нет файла' });
    
    const url = '/uploads/videos/' + req.file.filename;
    const { user, title, description } = req.body;
    
    db.run(
        'INSERT INTO videos (uuid, url, title, description, user, is_uploaded) VALUES (?, ?, ?, ?, ?, 1)',
        [uuidv4(), url, title || '', description || '', user || 'anonymous'],
        function() {
            res.json({ success: true, data: { id: this.lastID, url, user } });
        }
    );
});

// API: Добавить видео по ссылке
app.post('/api/videos', (req, res) => {
    const { url, user, description } = req.body;
    
    db.run(
        'INSERT INTO videos (uuid, url, user, description) VALUES (?, ?, ?, ?)',
        [uuidv4(), url, user, description || ''],
        function() {
            res.json({ success: true, data: { id: this.lastID, url, user } });
        }
    );
});

// API: Лайк
app.post('/api/videos/:id/like', (req, res) => {
    const videoId = req.params.id;
    const userId = req.body.userId || 'anonymous';
    
    db.get('SELECT * FROM likes WHERE video_id = ? AND user_id = ?', [videoId, userId], (err, row) => {
        if (row) {
            db.run('DELETE FROM likes WHERE id = ?', [row.id]);
        } else {
            db.run('INSERT INTO likes (video_id, user_id) VALUES (?, ?)', [videoId, userId]);
        }
        
        db.get('SELECT COUNT(*) as count FROM likes WHERE video_id = ?', [videoId], (err, row) => {
            res.json({ success: true, data: { liked: !row, likes: row.count } });
        });
    });
});

// API: Комментарии
app.get('/api/videos/:id/comments', (req, res) => {
    db.all('SELECT * FROM comments WHERE video_id = ? ORDER BY created_at DESC', [req.params.id], (err, rows) => {
        res.json({ success: true, data: rows || [] });
    });
});

app.post('/api/videos/:id/comments', (req, res) => {
    const { text, user } = req.body;
    db.run(
        'INSERT INTO comments (video_id, user, text) VALUES (?, ?, ?)',
        [req.params.id, user, text],
        function() {
            res.json({ success: true, data: { id: this.lastID, user, text } });
        }
    );
});

// API: Поиск
app.get('/api/videos/search', (req, res) => {
    const q = req.query.q || '';
    db.all('SELECT * FROM videos WHERE user LIKE ? OR description LIKE ? LIMIT 20', [`%${q}%`, `%${q}%`], (err, rows) => {
        res.json({ success: true, data: rows || [] });
    });
});

// API: Ивенты
app.get('/api/events/active', (req, res) => {
    db.get('SELECT * FROM events WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1', (err, event) => {
        if (!event) return res.json({ success: true, data: null });
        db.all('SELECT * FROM event_tasks WHERE event_id = ?', [event.id], (err, tasks) => {
            res.json({ success: true, data: { event, tasks: tasks || [] } });
        });
    });
});

// API: Админ (упрощённый)
app.get('/api/admin/stats', (req, res) => {
    const token = req.query.token;
    if (token !== 'monkey-admin-secret-2024') {
        return res.json({ success: false, error: 'Доступ запрещён' });
    }
    
    db.get('SELECT COUNT(*) as count FROM videos', (err, v) => {
        db.get('SELECT COUNT(*) as count FROM users', (err, u) => {
            db.get('SELECT SUM(likes) as count FROM videos', (err, l) => {
                res.json({
                    success: true,
                    data: {
                        totalVideos: v,
                        totalUsers: u,
                        totalLikes: l
                    }
                });
            });
        });
    });
});

// API: Создать ивент
app.post('/api/events/admin/create', (req, res) => {
    const token = req.headers['admin-token'];
    if (token !== 'monkey-admin-secret-2024') {
        return res.json({ success: false, error: 'Доступ запрещён' });
    }
    
    const { title, description, emoji } = req.body;
    db.run(
        'INSERT INTO events (title, description, emoji) VALUES (?, ?, ?)',
        [title, description, emoji || '🎉'],
        function() {
            res.json({ success: true, data: { id: this.lastID } });
        }
    );
});

// API: Включить ивент
app.post('/api/events/admin/:id/toggle', (req, res) => {
    const token = req.headers['admin-token'];
    if (token !== 'monkey-admin-secret-2024') {
        return res.json({ success: false, error: 'Доступ запрещён' });
    }
    
    db.run('UPDATE events SET is_active = ? WHERE id = ?', [req.body.isActive ? 1 : 0, req.params.id]);
    res.json({ success: true });
});

// Тестовые видео при первом запуске
db.get('SELECT COUNT(*) as count FROM videos', (err, row) => {
    if (row.count === 0) {
        const testVideos = [
            ['https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4', '@banana_king', '🦍', 'Когда нашёл идеальный банан 🍌'],
            ['https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4', '@jungle_vibes', '🐒', 'Утро в джунглях 🌴'],
            ['https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4', '@coconut_crazy', '🦧', 'Кокосовый рай 🥥']
        ];
        
        const stmt = db.prepare('INSERT INTO videos (uuid, url, user, avatar, description) VALUES (?, ?, ?, ?, ?)');
        testVideos.forEach(v => stmt.run(uuidv4(), v[0], v[1], v[2], v[3]));
        stmt.finalize();
    }
});

app.listen(PORT, () => {
    console.log('🐵 MonkeyVideos на порту ' + PORT);
});
