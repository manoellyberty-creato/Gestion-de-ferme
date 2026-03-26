import api from './api.js'

export function getCampaigns(params) {
  return api.get('/campaigns', { params })
}

export function getCampaignById(id) {
  return api.get(`/campaigns/${id}`)
}

export function createCampaign(payload, userId) {
  const path = userId ? `/campaigns/create/${userId}` : '/campaigns/create'
  return api.post(path, payload)
}

export function getCampaignsByManager(managerId) {
  return api.get(`/campaigns/manager/${managerId}`)
}

export function getCampaignsByCategory(categoryId) {
  return api.get(`/campaigns/category/${categoryId}`)
}

export function getCampaignsByDepartment(department) {
  return api.get(`/campaigns/department/${department}`)
}

// ===> Mise à jour et Suppression
export function updateCampaign(id, payload) {
  return api.patch(`/campaigns/update/${id}`, payload)
}

export function deleteCampaign(id) {
  return api.delete(`/campaigns/delete/${id}`)
}

// ===> Assignations
export function assignManager(campaignId, userId) {
  return api.put(`/campaigns/assignManager/${campaignId}/${userId}`)
}

export function assignAgent(campaignId, userId) {
  return api.put(`/campaigns/assignAgent/${campaignId}/${userId}`)
}

export function assignVeterinarian(campaignId, userId) {
  return api.put(`/campaigns/assignVeterinarian/${campaignId}/${userId}`)
}

export function assignComptable(campaignId, userId) {
  return api.put(`/campaigns/assignComptable/${campaignId}/${userId}`)
}

export function unassignMember(campaignId, userId) {
  return api.delete(`/campaigns/unassign/${campaignId}/${userId}`)
}
