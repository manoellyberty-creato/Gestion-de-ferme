import api from './api'

export function getAlerts(params) {
  return api.get('/alerts', { params })
}

export function getAlertById(id) {
  return api.get(`/alerts/${id}`)
}

export function createAlert(payload) {
  return api.post('/alerts', payload)
}

export function markAsRead(id) {
  return api.post(`/alerts/${id}/read`)
}

export function resolveAlert(id) {
  return api.post(`/alerts/${id}/resolve`)
}

export function generateAutomatedAlerts(payload) {
  return api.post('/alerts/generate', payload)
}
