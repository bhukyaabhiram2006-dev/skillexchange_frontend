import api from './apiClient';

/**
 * Normalizes backend profile response to the frontend student model
 */
export function normalizeStudentProfile(backendProfile) {
  if (!backendProfile) return null;
  return {
    id: backendProfile.id?.toString(),
    userId: backendProfile.userId?.toString(),
    name: backendProfile.name || '',
    email: backendProfile.email || '',
    headline: backendProfile.headline || '',
    college: backendProfile.college || '',
    course: backendProfile.course || '',
    year: backendProfile.yearOfStudy || backendProfile.year || '1st Year',
    bio: backendProfile.bio || '',
    avatar: backendProfile.avatarUrl || backendProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    preferredMode: backendProfile.preferredExchangeMode || backendProfile.preferredMode || 'Both',
    availability: backendProfile.availability || 'Weekdays & Weekends',
    rating: backendProfile.rating != null ? Number(backendProfile.rating) : 5.0,
    reviewCount: backendProfile.reviewCount || 0,
    exchangeCount: backendProfile.completedExchangesCount || backendProfile.exchangeCount || 0,
    skillsOffered: (backendProfile.skillsOffered || []).map((s) => ({
      id: s.id?.toString(),
      name: s.name,
      level: s.level || 'Intermediate',
      category: s.category || 'general',
      categoryName: s.categoryName,
    })),
    skillsDesired: (backendProfile.learningGoals || backendProfile.skillsDesired || []).map((g) => ({
      id: g.id?.toString(),
      name: g.name,
      priority: g.priority || 'High',
      category: g.category || 'general',
    })),
  };
}

export const profileService = {
  async getProfiles(params = {}) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set('page', params.page);
    if (params.size !== undefined) query.set('size', params.size);
    if (params.search) query.set('search', params.search);
    if (params.college && params.college !== 'All') query.set('college', params.college);
    if (params.mode && params.mode !== 'All') query.set('mode', params.mode);

    const qs = query.toString();
    const endpoint = `/profiles${qs ? `?${qs}` : ''}`;
    const page = await api.get(endpoint);
    return {
      content: (page.content || []).map(normalizeStudentProfile),
      totalElements: page.totalElements,
      totalPages: page.totalPages,
    };
  },

  async getProfileById(id) {
    const data = await api.get(`/profiles/${id}`);
    return normalizeStudentProfile(data);
  },

  async getMyProfile() {
    const data = await api.get('/profiles/me');
    return normalizeStudentProfile(data);
  },

  async updateMyProfile(profileData) {
    const payload = {
      name: profileData.name,
      headline: profileData.headline,
      college: profileData.college,
      course: profileData.course,
      yearOfStudy: profileData.year,
      bio: profileData.bio,
      preferredExchangeMode: profileData.preferredMode,
      availability: profileData.availability,
      avatarUrl: profileData.avatar,
    };
    const data = await api.put('/profiles/me', payload);
    return normalizeStudentProfile(data);
  },
};

export default profileService;
