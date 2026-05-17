class UI {
    static showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    }

    static formatCount(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    }

    static formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    static async openAdminPanel() {
        const token = prompt('Админ-токен:');
        if (!token) return;
        try {
            const stats = await api.getAdminStats(token);
            alert(`Статистика:\nВидео: ${stats.totalVideos.count}\nПользователей: ${stats.totalUsers.count}\nЛайков: ${stats.totalLikes.count}`);
            UI.showToast('Админ-панель открыта', 'success');
            window.adminToken = token;
        } catch (e) {
            UI.showToast('Неверный токен', 'error');
        }
    }

    static async searchVideos(query) {
        if (!query) return;
        const videos = await api.searchVideos(query);
        if (videos.length > 0) {
            player.init(videos);
            UI.showToast(`Найдено ${videos.length} видео`, 'success');
        } else {
            UI.showToast('Ничего не найдено', 'info');
        }
    }

    static async showMyVideos() {
        const user = localStorage.getItem('monkeyUser') || prompt('Ваше имя:');
        if (user) {
            localStorage.setItem('monkeyUser', user);
            const videos = await api.getMyVideos(user);
            if (videos.length > 0) {
                player.init(videos);
                UI.showToast(`Ваши видео: ${videos.length}`, 'info');
            } else {
                UI.showToast('У вас пока нет видео', 'info');
            }
        }
    }

    static async uploadVideoFile() {
        const file = UI.selectedFile;
        const user = document.getElementById('uploadUser')?.value || localStorage.getItem('monkeyUser') || 'anonymous';
        
        if (!file) return UI.showToast('Выберите файл', 'error');
        
        localStorage.setItem('monkeyUser', user);
        
        const formData = new FormData();
        formData.append('video', file);
        formData.append('user', user);
        formData.append('title', document.getElementById('uploadTitle')?.value || 'Моё видео');
        formData.append('description', document.getElementById('uploadDesc')?.value || '');

        try {
            const response = await fetch('/api/videos/upload', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                UI.showToast('Видео загружено! 🎉', 'success');
                UI.closeUploadModal();
                await monkeyApp.loadVideos();
            } else {
                UI.showToast(data.error || 'Ошибка', 'error');
            }
        } catch (error) {
            UI.showToast('Ошибка загрузки', 'error');
        }
    }

    static openUploadModal() {
        document.getElementById('uploadModal').style.display = 'flex';
        const user = localStorage.getItem('monkeyUser');
        if (user) {
            const el = document.getElementById('uploadUser');
            if (el) el.value = user;
        }
    }

    static closeUploadModal() {
        document.getElementById('uploadModal').style.display = 'none';
    }
}

window.UI = UI;