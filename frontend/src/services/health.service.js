import api from './api'

export function createProduct(payload) {
  return api.post('/health/products', payload)
}

export function getProducts(params) {
  return api.get('/health/products', { params })
}

export function getProductById(id) {
  return api.get(`/health/products/${id}`)
}

export function createPrescription(payload) {
  return api.post('/health/prescriptions', payload)
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
