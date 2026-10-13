import api from './apiClient';

export const reviewService = {
  async getStudentReviews(studentId) {
    const list = await api.get(`/reviews/student/${studentId}`);
    return Array.isArray(list) ? list : [];
  },

  async createReview({ exchangeId, revieweeId, rating, comment }) {
    return await api.post('/reviews', {
      exchangeId: exchangeId ? Number(exchangeId) : undefined,
      revieweeId: Number(revieweeId),
      rating: Number(rating),
      comment,
    });
  },
};

export default reviewService;
