import api, { setStoredToken, clearStoredToken } from './apiClient';

export const authService = {
  async login(email, password, rememberMe = true) {
    const data = await api.post('/auth/login', { email, password, rememberMe });
    if (data && data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  async register(formData) {
    const data = await api.post('/auth/register', formData);
    if (data && data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  async getCurrentUser() {
    return await api.get('/auth/me');
  },

  logout() {
    clearStoredToken();
  },
};

export default authService;
