import api from './api.js'

export function getCampaigns(params) {
  return api.get('/campaign', { params })
}

export function getCampaignById(id) {
  return api.get(`/campaign/${id}`)
}

export function createCampaign(payload, userId) {
  const path = userId ? `/campaign/create/${userId}` : '/campaign/create'
  return api.post(path, payload)
}

export function getCampaignsByManager(managerId) {
  return api.get(`/campaign/manager/${managerId}`)
}

export function getCampaignsByCategory(categoryId) {
  return api.get(`/campaign/category/${categoryId}`)
}

export function getCampaignsByDepartment(department) {
  return api.get(`/campaign/department/${department}`)
}

// ===> Mise à jour et Suppression
export function updateCampaign(id, payload) {
  return api.patch(`/campaign/update/${id}`, payload)
}

export function deleteCampaign(id) {
  return api.delete(`/campaign/delete/${id}`)
}

// ===> Assignations
export function assignManager(campaignId, userId) {
  return api.put(`/campaign/assignManager/${campaignId}/${userId}`)
}

export function assignAgent(campaignId, userId) {
  return api.put(`/campaign/assignAgent/${campaignId}/${userId}`)
}

export function assignVeterinarian(campaignId, userId) {
  return api.put(`/campaign/assignVeterinarian/${campaignId}/${userId}`)
}

export function assignComptable(campaignId, userId) {
  return api.put(`/campaign/assignComptable/${campaignId}/${userId}`)
}

export function unassignMember(campaignId, userId) {
  return api.delete(`/campaign/unassign/${campaignId}/${userId}`)
}
