import api from './apiClient';

export const matchingService = {
  async getRecommendations() {
    const list = await api.get('/matches/recommendations');
    return Array.isArray(list) ? list : [];
  },

  async getMatchWithStudent(studentId) {
    return await api.get(`/matches/student/${studentId}`);
  },
};

export default matchingService;
