import api from './apiClient';

export const notificationService = {
  async getNotifications() {
    const list = await api.get('/notifications');
    return Array.isArray(list) ? list : [];
  },

  async markAsRead(notificationId) {
    return await api.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead() {
    return await api.put('/notifications/read-all');
  },
};

export default notificationService;
