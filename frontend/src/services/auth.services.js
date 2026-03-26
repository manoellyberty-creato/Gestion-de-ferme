import api from './api';

export const authService = {
  async login(credentials) {
    // credentials contient { email, password }
    const response = await api.post('/auth/login', credentials);
    return response.data; 
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};