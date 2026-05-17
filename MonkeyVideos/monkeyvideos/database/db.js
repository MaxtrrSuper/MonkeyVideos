const path = require('path');

// Авто-определение пути
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'monkeyvideos.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка БД:', err.message);
    } else {
        console.log('🗄️ База данных:', dbPath);
    }
});
