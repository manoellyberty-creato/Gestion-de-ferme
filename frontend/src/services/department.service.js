import api from './api.js'

export function getAllDepartments(params) {
  return api.get('/departments', { params })
}

export function getDepartmentById(id) {
  return api.get(`/departments/${id}`)
}
