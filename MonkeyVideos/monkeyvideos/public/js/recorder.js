class VideoRecorder {
    constructor() {
        this.stream = null;
        this.mediaRecorder = null;
        this.chunks = [];
        this.recordedFile = null;
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const preview = document.getElementById('cameraPreview');
            if (preview) { preview.srcObject = this.stream; preview.style.display = 'block'; }
            return true;
        } catch(e) {
            UI.showToast('Нет доступа к камере', 'error');
            return false;
        }
    }

    startRecording() {
        if (!this.stream) return;
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            this.recordedFile = new File([blob], `recording_${Date.now()}.webm`, { type: 'video/webm' });
            UI.showToast('Запись завершена', 'success');
        };
        this.mediaRecorder.start();
        UI.showToast('Запись началась', 'info');
    }

    stopRecording() {
        if (this.mediaRecorder) this.mediaRecorder.stop();
    }

    getRecordedFile() { return this.recordedFile; }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
        }
    }
}

window.recorder = new VideoRecorder();