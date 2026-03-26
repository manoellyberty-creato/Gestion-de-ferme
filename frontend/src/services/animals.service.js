import api from './api'

export function getAllAnimals(params) {
  return api.get('/animals', { params })
}

export function getAnimalById(id) {
  return api.get(`/animals/${id}`)
}

export function generateAnimalQRCode(id) {
  return api.get(`/animals/${id}/qrcode`, { responseType: 'blob' })
}

export function scanAnimal(tagNumber) {
  return api.get(`/animals/scan/${tagNumber}`)
}

export function getAnimalHistory(tagNumber) {
  return api.get(`/animals/scan/${tagNumber}/history`)
}

export function getCampaignAnimalStats(campaignId) {
  return api.get(`/animals/campaign/${campaignId}/stats`)
}

export function updateAnimalWeight(tagNumber, weight) {
  return api.put(`/animals/scan/${tagNumber}/weight`, { weight })
}

export function updateAnimalStatus(tagNumber, status, additionalData = {}) {
  return api.put(`/animals/scan/${tagNumber}/status`, { status, ...additionalData })
}
