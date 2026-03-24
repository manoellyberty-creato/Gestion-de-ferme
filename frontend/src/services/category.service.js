import api from './api.js'

export function getAllCategories(params) {
  return api.get('/categories', { params })
}

export function getCategoryById(id) {
  return api.get(`/categories/${id}`)
}
