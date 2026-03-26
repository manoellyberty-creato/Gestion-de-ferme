import api from './api'

// Campagnes
export function getCampaigns(params) {
  return api.get('/campaigns', { params })
}

export function getCampaignById(id) {
  return api.get(`/campaigns/${id}`)
}

export function getCampaignStats(id) {
  return api.get(`/campaigns/${id}/stats`)
}

// Animaux
export function getAnimals(params) {
  return api.get('/animals', { params })
}

export function getAnimalStats(campaignId) {
  return api.get(`/animals/campaign/${campaignId}/stats`)
}

export function getHealthyAnimals(campaignId) {
  return api.get(`/animals/campaign/${campaignId}/healthy`)
}

export function getSickAnimals(campaignId) {
  return api.get(`/animals/campaign/${campaignId}/sick`)
}

// Rapports opérationnels
export function getCampaignFinancial(campaignId) {
  return api.get(`/reports/campaigns/${campaignId}/financial`)
}

export function getCampaignROI(campaignId) {
  return api.get(`/reports/campaigns/${campaignId}/roi`)
}

// Alertes opérationnelles
export function getOperationalAlerts(campaignId) {
  return api.get(`/alerts/operational`, { params: { campaign: campaignId } })
}
