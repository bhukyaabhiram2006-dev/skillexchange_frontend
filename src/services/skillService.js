import api from './apiClient';

/**
 * Normalizes backend skill response to frontend SkillCard format
 */
export function normalizeSkill(backendSkill) {
  if (!backendSkill) return null;
  return {
    id: backendSkill.id?.toString(),
    title: backendSkill.name || backendSkill.title,
    name: backendSkill.name || backendSkill.title,
    description: backendSkill.description || '',
    category: backendSkill.category || 'general',
    categoryName: backendSkill.categoryName || backendSkill.category,
    level: backendSkill.level || 'Intermediate',
    format: backendSkill.format || '1-on-1 Mentoring',
    studentId: backendSkill.studentId?.toString() || 'user-current',
    studentName: backendSkill.studentName || 'Student',
    studentAvatar: backendSkill.studentAvatarUrl || backendSkill.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    college: backendSkill.studentCollege || backendSkill.college || 'University Partner',
    rating: backendSkill.studentRating != null ? Number(backendSkill.studentRating) : 5.0,
    exchangeCount: backendSkill.studentExchangeCount || backendSkill.exchangeCount || 0,
    tags: Array.isArray(backendSkill.tags) ? backendSkill.tags : [],
    lookingFor: backendSkill.lookingFor || 'Any reciprocal skill',
  };
}

export const skillService = {
  async getSkills(params = {}) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set('page', params.page);
    if (params.size !== undefined) query.set('size', params.size);
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.level) query.set('level', params.level);
    if (params.format) query.set('format', params.format);

    const qs = query.toString();
    const endpoint = `/skills${qs ? `?${qs}` : ''}`;
    const page = await api.get(endpoint);
    return {
      content: (page.content || []).map(normalizeSkill),
      totalElements: page.totalElements,
      totalPages: page.totalPages,
    };
  },

  async getSkillById(id) {
    const data = await api.get(`/skills/${id}`);
    return normalizeSkill(data);
  },

  async createSkill(skillData) {
    const payload = {
      name: skillData.title || skillData.name,
      category: skillData.category || 'general',
      categoryName: skillData.categoryName || skillData.category,
      level: skillData.level || 'Intermediate',
      format: skillData.format || '1-on-1 Mentoring',
      description: skillData.description,
      tags: Array.isArray(skillData.tags) ? skillData.tags : [],
      lookingFor: skillData.lookingFor,
    };
    const data = await api.post('/skills', payload);
    return normalizeSkill(data);
  },

  async getMyOfferedSkills() {
    const data = await api.get('/skills/my-offered');
    return Array.isArray(data) ? data.map(normalizeSkill) : [];
  },

  async getMyLearningGoals() {
    const data = await api.get('/skills/my-goals');
    return Array.isArray(data) ? data : [];
  },

  async addLearningGoal(goalData) {
    return await api.post('/skills/my-goals', goalData);
  },

  async removeLearningGoal(goalId) {
    return await api.delete(`/skills/my-goals/${goalId}`);
  },
};

export default skillService;
