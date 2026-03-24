import api from './api'

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
