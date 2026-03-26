import api from './api'

// Products
export function createProduct(payload) {
  return api.post('/health/products', payload)
}

export function getProducts(params) {
  return api.get('/health/products', { params })
}

export function getProductById(id) {
  return api.get(`/health/products/${id}`)
}

export function updateProduct(id, payload) {
  return api.put(`/health/products/${id}`, payload)
}

export function deleteProduct(id) {
  return api.delete(`/health/products/${id}`)
}

// Prescriptions
export function createPrescription(payload) {
  return api.post('/health/prescriptions', payload)
}

export function getPrescriptions(params) {
  return api.get('/health/prescriptions', { params })
}

export function getPrescriptionById(id) {
  return api.get(`/health/prescriptions/${id}`)
}

export function updatePrescription(id, payload) {
  return api.put(`/health/prescriptions/${id}`, payload)
}

export function deletePrescription(id) {
  return api.delete(`/health/prescriptions/${id}`)
}

export function updatePrescriptionStatus(id, status) {
  return api.patch(`/health/prescriptions/${id}/status`, { status })
}

export function getAnimalPrescriptions(animalId) {
  return api.get(`/health/animals/${animalId}/prescriptions`)
}

export function getCampaignPrescriptions(campaignId) {
  return api.get(`/health/campaigns/${campaignId}/prescriptions`)
}

export function addAdministration(prescriptionId, payload) {
  return api.post(`/health/prescriptions/${prescriptionId}/administrations`, payload)
}

// Statistics & Alerts
export function getHealthStatistics() {
  return api.get('/health/statistics')
}

export function getExpiredProducts() {
  return api.get('/health/products/expired')
}

export function getNearExpirationProducts() {
  return api.get('/health/products/near-expiration')
}

export function getHealthAlerts() {
  return api.get('/health/alerts')
}
