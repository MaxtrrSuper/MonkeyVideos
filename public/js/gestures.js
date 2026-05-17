class GestureHandler {
    constructor() {
        this.startY = 0;
    }

    init() {
        const feed = document.getElementById('videoFeed');
        feed?.addEventListener('touchstart', (e) => { this.startY = e.touches[0].clientY; }, { passive: false });
        feed?.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientY - this.startY;
            if (Math.abs(diff) > 50) {
                diff < 0 ? player.nextVideo() : player.previousVideo();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') player.previousVideo();
            if (e.key === 'ArrowDown') player.nextVideo();
        });
    }
}

window.gestures = new GestureHandler();