class MonkeyAPI {
    constructor() { this.baseURL = '/api'; }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = { headers: { 'Content-Type': 'application/json' }, ...options };
        const response = await fetch(url, config);
        if (!response.ok) throw new Error('Ошибка сервера');
        return await response.json();
    }

    async getVideos() { const d = await this.request('/videos'); return d.data; }
    async createVideo(data) { const d = await this.request('/videos', { method: 'POST', body: JSON.stringify(data) }); return d.data; }
    async searchVideos(q) { const d = await this.request(`/videos/search?q=${encodeURIComponent(q)}`); return d.data; }
    async getPopularVideos() { const d = await this.request('/videos/popular'); return d.data; }
    async getMyVideos(user) { const d = await this.request(`/videos/my?user=${encodeURIComponent(user)}`); return d.data; }
    async toggleLike(videoId, userId = 'anonymous') { const d = await this.request(`/videos/${videoId}/like`, { method: 'POST', body: JSON.stringify({ userId }) }); return d.data; }
    async getComments(videoId) { const d = await this.request(`/videos/${videoId}/comments`); return d.data; }
    async addComment(videoId, text, user) { const d = await this.request(`/videos/${videoId}/comments`, { method: 'POST', body: JSON.stringify({ text, user }) }); return d.data; }
    async getAdminStats(token) { const d = await this.request(`/admin/stats?token=${token}`); return d.data; }
    async getAdminUsers(token) { const d = await this.request(`/admin/users?token=${token}`); return d.data; }
    async verifyUser(id, token) { return await this.request(`/admin/users/${id}/verify`, { method: 'POST', headers: { 'admin-token': token } }); }
    async banUser(id, reason, token) { return await this.request(`/admin/users/${id}/ban`, { method: 'POST', headers: { 'admin-token': token }, body: JSON.stringify({ reason }) }); }
    async createEvent(data, token) { return await this.request('/events/admin/create', { method: 'POST', headers: { 'admin-token': token }, body: JSON.stringify(data) }); }
    async toggleEvent(id, isActive, token) { return await this.request(`/events/admin/${id}/toggle`, { method: 'POST', headers: { 'admin-token': token }, body: JSON.stringify({ isActive }) }); }
}

window.api = new MonkeyAPI();