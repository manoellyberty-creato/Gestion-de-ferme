import api from './api'

export function getUsers(params) {
  return api.get('/users', { params })
}

export function addUser(payload) {
  return api.post('/users', payload)
}
