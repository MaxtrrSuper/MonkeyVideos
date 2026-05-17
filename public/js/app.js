class MonkeyVideosApp {
    constructor() {
        this.isLoading = true;
    }

    async init() {
        console.log('🐵 MonkeyVideos запускается...');
        gestures.init();
        this.setupModals();
        this.setupForms();
        await this.loadVideos();
        this.hideLoadingScreen();
    }

    async loadVideos() {
        try {
            const videos = await api.getVideos();
            if (videos && videos.length > 0) {
                player.init(videos);
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    }

    setupModals() {
        document.getElementById('uploadBtn')?.addEventListener('click', () => UI.openUploadModal());
        document.getElementById('recordBtn2')?.addEventListener('click', () => {
            document.getElementById('recordModal')?.style.display = 'flex';
        });
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            document.getElementById('searchBar').style.display = 'flex';
            document.getElementById('searchInput').focus();
        });
        document.getElementById('searchClose')?.addEventListener('click', () => {
            document.getElementById('searchBar').style.display = 'none';
        });
        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') UI.searchVideos(e.target.value);
        });
        document.getElementById('myVideosBtn')?.addEventListener('click', () => UI.showMyVideos());
        
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').style.display = 'none';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') UI.openAdminPanel();
        });
    }

    setupForms() {
        document.getElementById('uploadFileForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await UI.uploadVideoFile();
        });
        document.getElementById('uploadUrlForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const url = document.getElementById('videoUrl').value;
            const user = document.getElementById('urlUser').value;
            const desc = document.getElementById('urlDesc').value;
            try {
                await api.createVideo({ url, user, description: desc });
                UI.closeUploadModal();
                UI.showToast('Видео добавлено! 🎉', 'success');
                await this.loadVideos();
            } catch (error) {
                UI.showToast('Ошибка', 'error');
            }
        });
        document.getElementById('saveRecordForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = recorder.getRecordedFile();
            if (!file) return UI.showToast('Сначала запишите видео', 'error');
            UI.selectedFile = file;
            await UI.uploadVideoFile();
            document.getElementById('recordModal').style.display = 'none';
            recorder.stopCamera();
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const el = document.getElementById('loadingScreen');
            if (el) { el.classList.add('hidden'); setTimeout(() => el.remove(), 500); }
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.monkeyApp = new MonkeyVideosApp();
    window.monkeyApp.init();
});