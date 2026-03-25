import api from './api'

// Prescriptions
export function getPrescriptions(params) {
  return api.get('/health/prescriptions', { params })
}

export function getPrescriptionById(id) {
  return api.get(`/health/prescriptions/${id}`)
}

export function getAnimalPrescriptions(animalId) {
  return api.get(`/health/animals/${animalId}/prescriptions`)
}

export function getCampaignPrescriptions(campaignId) {
  return api.get(`/health/campaigns/${campaignId}/prescriptions`)
}

// Produits santé
export function getHealthProducts(params) {
  return api.get('/health/products', { params })
}

export function getExpiredProducts() {
  return api.get('/health/products/expired')
}

export function getNearExpirationProducts() {
  return api.get('/health/products/near-expiration')
}

// Animaux malades
export function getSickAnimals(campaignId) {
  return api.get(`/animals/campaign/${campaignId}/sick`)
}

export function getAnimalHealthHistory(animalId) {
  return api.get(`/animals/${animalId}/health-history`)
}

// Statistiques santé
export function getHealthStatistics(campaignId) {
  return api.get('/health/statistics', { params: { campaign: campaignId } })
}

// Alertes santé
export function getHealthAlerts() {
  return api.get('/health/alerts')
}

export function createPrescription(data) {
  return api.post('/health/prescriptions', data)
}

export function updatePrescription(id, data) {
  return api.put(`/health/prescriptions/${id}`, data)
}

export function addAdministration(prescriptionId, data) {
  return api.post(`/health/prescriptions/${prescriptionId}/administrations`, data)
}
