import api from './api'

export function getFeeds(params) {
  return api.get('/feed', { params })
}

export function getFeedById(id) {
  return api.get(`/feed/${id}`)
}

export function createFeed(payload) {
  return api.post('/feed', payload)
}

export function updateFeed(id, payload) {
  return api.put(`/feed/${id}`, payload)
}

export function deleteFeed(id) {
  return api.delete(`/feed/${id}`)
}

export function updateStock(id, quantity) {
  return api.patch(`/feed/${id}/stock`, { stock: quantity })
}

export function deactivateFeed(id) {
  return api.patch(`/feed/${id}/deactivate`, {})
}

export function getLowStockAlerts() {
  return api.get('/feed/alerts/low-stock')
}

export function getExpiringSoon() {
  return api.get('/feed/alerts/expiring-soon')
}

export function getFeedStatsSummary() {
  return api.get('/feed/stats/summary')
}

export function searchFeed(q) {
  return api.get('/feed/search', { params: { q } })
}
