function errorHandler(err, req, res, next) {
    console.error('Ошибка:', err.message);
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, error: 'Файл слишком большой' });
    }
    
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Внутренняя ошибка сервера' : err.message
    });
}

module.exports = errorHandler;