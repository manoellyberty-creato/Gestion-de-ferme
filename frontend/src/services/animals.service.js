import axios from "axios";
const API_URL = "http://localhost:7000/api/animals"; // Ajuste selon ton port

export const animalService = {
  getAll: () => axios.get(API_URL).then(res => res.data),
  getOne: (id) => axios.get(`${API_URL}/${id}`).then(res => res.data),
  create: (data) => axios.post(API_URL, data).then(res => res.data),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data).then(res => res.data),
  delete: (id) => axios.delete(`${API_URL}/${id}`).then(res => res.data),
};