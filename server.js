const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initializeDatabase } = require('./database/db');
const errorHandler = require('./middleware/errorHandler');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Папка для загрузок
const uploadsDir = process.env.UPLOAD_PATH || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Роуты
app.use('/api/videos', videoRoutes);
app.use('/api/videos/:videoId/comments', commentRoutes);
app.use('/api/videos/:videoId/like', likeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка ошибок
app.use(errorHandler);

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Маршрут не найден' });
});

// Запуск
async function start() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`🐵 MonkeyVideos запущен на порту ${PORT}`);
    });
}

start();