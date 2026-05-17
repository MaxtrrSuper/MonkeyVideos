class VideoPlayer {
    constructor() {
        this.currentIndex = 0;
        this.videos = [];
        this.isTransitioning = false;
    }

    init(videos) {
        this.videos = videos;
        this.currentIndex = 0;
        this.renderVideos();
        this.playCurrentVideo();
    }

    renderVideos() {
        const feed = document.getElementById('videoFeed');
        feed.innerHTML = '';
        
        this.videos.forEach((video, index) => {
            const container = document.createElement('div');
            container.className = 'video-container';
            container.style.transform = `translateY(${index * 100}%)`;
            container.innerHTML = `
                <div class="video-wrapper">
                    <video src="${video.url}" loop muted playsinline></video>
                </div>
                <div class="actions">
                    <div class="action-btn like-btn" data-id="${video.id}">
                        <div class="action-icon">❤️</div>
                        <span>${UI.formatCount(video.likes)}</span>
                    </div>
                </div>
                <div class="info">
                    <div class="user-badge">
                        <div class="avatar">${video.avatar || '🐵'}</div>
                        <span class="username">${video.user || '@user'}</span>
                    </div>
                    <div class="description">${video.description || ''}</div>
                </div>
            `;
            
            container.querySelector('.like-btn')?.addEventListener('click', async (e) => {
                e.stopPropagation();
                const btn = e.currentTarget;
                btn.classList.toggle('active');
                try {
                    const result = await api.toggleLike(video.id);
                    btn.querySelector('span').textContent = UI.formatCount(result.likes);
                } catch(e) {}
            });
            
            feed.appendChild(container);
        });
    }

    playCurrentVideo() {
        document.querySelectorAll('.video-container video').forEach((v, i) => {
            if (i === this.currentIndex) v.play().catch(() => {});
            else v.pause();
        });
    }

    nextVideo() { this.switchToVideo(this.currentIndex + 1); }
    previousVideo() { this.switchToVideo(this.currentIndex - 1); }

    switchToVideo(index) {
        if (index === this.currentIndex || this.isTransitioning || index < 0 || index >= this.videos.length) return;
        this.isTransitioning = true;
        this.currentIndex = index;
        
        document.querySelectorAll('.video-container').forEach((c, i) => {
            c.style.transform = `translateY(${(i - index) * 100}%)`;
        });
        
        setTimeout(() => { this.playCurrentVideo(); this.isTransitioning = false; }, 350);
    }
}

window.player = new VideoPlayer();