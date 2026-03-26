import api from './api';

export const userService = {
  // Récupérer tous les utilisateurs
  async getAll() {
    const { data } = await api.get('/users');
    return data;
  },

  // Créer un utilisateur
  async create(userData) {
    const { data } = await api.post('/users', userData);
    return data;
  },

  // Modifier un utilisateur
  async update(id, userData) {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  // Supprimer un utilisateur
  async delete(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  }
};