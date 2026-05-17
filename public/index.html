<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>MonkeyVideos 🐵</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; background: #0f0f1a; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .header { position: fixed; top: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(180deg, rgba(15,15,26,0.95) 0%, transparent 100%); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 22px; font-weight: 800; }
        .logo span { color: #ff6b35; }
        .header-btns { display: flex; gap: 12px; }
        .icon-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,0.12); color: white; font-size: 18px; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(10px); }
        .icon-btn:active { transform: scale(0.9); background: rgba(255,255,255,0.25); }
        
        .video-feed { position: relative; width: 100%; height: 100%; touch-action: pan-y; }
        .video-item { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); will-change: transform; }
        .video-wrapper { position: relative; width: 100%; height: 100%; overflow: hidden; }
        .video-wrapper video { width: 100%; height: 100%; object-fit: cover; }
        .video-wrapper::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 45%; background: linear-gradient(transparent, rgba(0,0,0,0.7)); pointer-events: none; }
        
        .actions { position: absolute; right: 12px; bottom: 120px; display: flex; flex-direction: column; gap: 22px; z-index: 10; }
        .action-btn { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.15s; }
        .action-btn:active { transform: scale(0.85); }
        .action-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-size: 24px; transition: all 0.2s; }
        .action-btn.liked .action-icon { background: #ff2d55; animation: pulse 0.4s ease; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        .action-btn span { font-size: 12px; font-weight: 700; margin-top: 5px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
        
        .info { position: absolute; bottom: 24px; left: 14px; right: 80px; z-index: 10; }
        .user-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .avatar { width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid #ff6b35; }
        .username { font-weight: 700; font-size: 16px; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
        .desc { font-size: 14px; line-height: 1.4; text-shadow: 0 1px 3px rgba(0,0,0,0.6); opacity: 0.9; }
        
        .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: none; align-items: flex-end; justify-content: center; z-index: 200; }
        .modal.active { display: flex; }
        .modal-content { background: #1a1a2e; border-radius: 20px 20px 0 0; width: 100%; max-width: 500px; max-height: 85vh; overflow-y: auto; padding: 24px; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h2 { font-size: 20px; }
        .close-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); color: white; font-size: 18px; cursor: pointer; }
        .form-group { margin-bottom: 14px; }
        .form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: #999; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; border-radius: 10px; border: 2px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; font-size: 15px; outline: none; }
        .form-group input:focus, .form-group textarea:focus { border-color: #ff6b35; }
        .upload-zone { border: 2px dashed rgba(255,255,255,0.2); border-radius: 14px; padding: 30px; text-align: center; cursor: pointer; margin-bottom: 16px; transition: all 0.2s; }
        .upload-zone:hover { border-color: #ff6b35; background: rgba(255,107,53,0.05); }
        .upload-zone p { margin: 8px 0; font-size: 14px; }
        .upload-zone span { font-size: 12px; color: #888; }
        .submit-btn { width: 100%; padding: 14px; border-radius: 25px; border: none; background: #ff6b35; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .submit-btn:active { transform: scale(0.97); background: #e55a2b; }
        
        .toast-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 300; display: flex; flex-direction: column; gap: 8px; }
        .toast { padding: 12px 24px; border-radius: 25px; background: rgba(0,0,0,0.9); color: white; font-size: 14px; font-weight: 600; backdrop-filter: blur(10px); animation: toastIn 0.3s ease; text-align: center; }
        @keyframes toastIn { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        
        .badge { position: absolute; top: 80px; left: 14px; background: #ff6b35; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; z-index: 10; }
    </style>
</head>
<body>

    <header class="header">
        <div class="logo">🐵 Monkey<span>Videos</span></div>
        <div class="header-btns">
            <button class="icon-btn" onclick="openUpload()" title="Загрузить видео">➕</button>
            <button class="icon-btn" onclick="openAdmin()" title="Админ-панель">⚙️</button>
        </div>
    </header>

    <main class="video-feed" id="videoFeed"></main>
    <div class="toast-container" id="toastContainer"></div>

    <!-- Модалка загрузки -->
    <div class="modal" id="uploadModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>📤 Загрузить видео</h2>
                <button class="close-btn" onclick="closeUpload()">✕</button>
            </div>
            <div class="upload-zone" id="dropZone" onclick="document.getElementById('fileInput').click()">
                <div style="font-size:40px;">🎬</div>
                <p>Нажмите, чтобы выбрать видео</p>
                <span>MP4, WebM до 50MB</span>
            </div>
            <input type="file" id="fileInput" accept="video/*" style="display:none" onchange="fileSelected(event)">
            <div id="fileInfo" style="display:none; margin-bottom:14px; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px;"></div>
            <div class="form-group"><input type="text" id="uploadUser" placeholder="Ваше имя @username"></div>
            <div class="form-group"><textarea id="uploadDesc" rows="2" placeholder="Описание видео..."></textarea></div>
            <button class="submit-btn" onclick="uploadVideo()">🚀 Загрузить</button>
        </div>
    </div>

<script>
let videos = [];
let currentIndex = 0;
let startY = 0;
let selectedFile = null;

// Загрузка видео с сервера
async function loadVideos() {
    try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        videos = data.data || [];
        renderVideos();
    } catch(e) {
        console.error('Ошибка загрузки:', e);
    }
}

// Отрисовка всех видео
function renderVideos() {
    const feed = document.getElementById('videoFeed');
    feed.innerHTML = '';
    
    if (videos.length === 0) {
        feed.innerHTML = '<div style="text-align:center;padding-top:40vh;"><div style="font-size:80px;">🐵</div><h2>Нет видео</h2><p style="color:#888;">Загрузите первое!</p></div>';
        return;
    }
    
    videos.forEach((v, i) => {
        const el = document.createElement('div');
        el.className = 'video-item';
        el.style.transform = `translateY(${i * 100}%)`;
        el.innerHTML = `
            <div class="video-wrapper">
                <video src="${v.url}" loop muted playsinline preload="metadata"></video>
            </div>
            ${v.is_uploaded ? '<div class="badge">📤 Загружено</div>' : ''}
            <div class="actions">
                <div class="action-btn" onclick="toggleLike(${v.id}, this)">
                    <div class="action-icon">❤️</div>
                    <span>${formatCount(v.likes || 0)}</span>
                </div>
                <div class="action-btn" onclick="showToast('💬 Комментарии скоро')">
                    <div class="action-icon">💬</div>
                    <span>0</span>
                </div>
            </div>
            <div class="info">
                <div class="user-row">
                    <div class="avatar">${v.avatar || '🐵'}</div>
                    <span class="username">${v.user || '@user'}</span>
                </div>
                <div class="desc">${v.description || ''}</div>
            </div>
        `;
        feed.appendChild(el);
    });
    
    if (videos.length > 0) playVideo(0);
}

// Воспроизведение видео
function playVideo(index) {
    currentIndex = index;
    document.querySelectorAll('video').forEach((v, i) => {
        if (i === index) v.play().catch(() => {});
        else { v.pause(); v.currentTime = 0; }
    });
}

// Переключение видео
function switchVideo(index) {
    if (index < 0 || index >= videos.length || index === currentIndex) return;
    currentIndex = index;
    document.querySelectorAll('.video-item').forEach((el, i) => {
        el.style.transform = `translateY(${(i - index) * 100}%)`;
    });
    setTimeout(() => playVideo(index), 350);
}

// Лайк
async function toggleLike(videoId, btn) {
    try {
        const res = await fetch(`/api/videos/${videoId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'user_' + Date.now() })
        });
        const data = await res.json();
        if (data.success) {
            btn.classList.toggle('liked', data.data.liked);
            btn.querySelector('span').textContent = formatCount(data.data.likes);
        }
    } catch(e) {
        btn.classList.toggle('liked');
    }
}

// Загрузка видео
function openUpload() { document.getElementById('uploadModal').classList.add('active'); }
function closeUpload() { document.getElementById('uploadModal').classList.remove('active'); }

function fileSelected(e) {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        document.getElementById('fileInfo').style.display = 'block';
        document.getElementById('fileInfo').innerHTML = `📁 ${selectedFile.name} (${(selectedFile.size/1024/1024).toFixed(1)}MB)`;
    }
}

async function uploadVideo() {
    if (!selectedFile) return showToast('❌ Выберите видео');
    
    const user = document.getElementById('uploadUser').value || 'user_' + Date.now();
    const desc = document.getElementById('uploadDesc').value;
    
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('user', user);
    formData.append('description', desc);
    
    try {
        const res = await fetch('/api/videos/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            closeUpload();
            showToast('🎉 Видео загружено!');
            loadVideos();
        } else {
            showToast('❌ ' + (data.error || 'Ошибка'));
        }
    } catch(e) {
        showToast('❌ Ошибка загрузки');
    }
}

// Админка
async function openAdmin() {
    const token = prompt('🔑 Админ-токен:');
    if (!token) return;
    
    try {
        const res = await fetch(`/api/admin/stats?token=${token}`);
        const data = await res.json();
        if (data.success) {
            const action = prompt(`📊 Статистика:\nВидео: ${data.data.totalVideos}\nПользователей: ${data.data.totalUsers}\n\nСоздать ивент? (название / нет)`);
            if (action && action !== 'нет') {
                const res2 = await fetch('/api/events/admin/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'admin-token': token },
                    body: JSON.stringify({ title: action, emoji: '🎉' })
                });
                const data2 = await res2.json();
                if (data2.success) showToast('🎉 Ивент создан!');
            }
        } else {
            showToast('❌ Неверный токен');
        }
    } catch(e) {
        showToast('❌ Ошибка');
    }
}

// Вспомогательное
function formatCount(n) {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n/1000).toFixed(1) + 'K';
    return String(n || 0);
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.getElementById('toastContainer').appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2000);
}

// Свайпы
document.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, {passive: false});
document.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientY - startY;
    if (Math.abs(diff) > 50) diff < 0 ? switchVideo(currentIndex + 1) : switchVideo(currentIndex - 1);
});

// Клавиатура
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') switchVideo(currentIndex - 1);
    if (e.key === 'ArrowDown') switchVideo(currentIndex + 1);
});

// Drag & Drop
const dropZone = document.getElementById('dropZone');
if (dropZone) {
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = '#ff6b35'; });
    dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '';
        if (e.dataTransfer.files[0]) {
            selectedFile = e.dataTransfer.files[0];
            document.getElementById('fileInfo').style.display = 'block';
            document.getElementById('fileInfo').innerHTML = `📁 ${selectedFile.name} (${(selectedFile.size/1024/1024).toFixed(1)}MB)`;
        }
    });
}

// Запуск
loadVideos();
</script>
</body>
</html>
