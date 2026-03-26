import api from './api'

// Campaigns
export const getCampaigns = (params = {}) => {
  return api.get('/campaigns', { params })
}

export const getCampaignById = (id) => {
  return api.get(`/campaigns/${id}`)
}

// Animals
export const getAnimals = (params = {}) => {
  return api.get('/animals', { params })
}

export const getSickAnimals = (campaignId) => {
  return api.get(`/animals/campaign/${campaignId}/sick`)
}

// Alerts
export const getAlerts = () => {
  return api.get('/alerts')
}

export const markAlertRead = (alertId) => {
  return api.post(`/alerts/${alertId}/read`)
}

// Fallback work tasks (local/dummy data) - not backend yet
export const getAgentTasks = () => {
  return Promise.resolve({
    data: {
      data: [
        {
          _id: 'task-1',
          title: 'Peser 20 animaux (Campagne A)',
          campaignId: null,
          dueDate: new Date().toISOString(),
          status: 'pending',
          progress: 25,
          description: 'Pesée et étiquetage des animaux du lot 1.'
        },
        {
          _id: 'task-2',
          title: 'Distribuer la ration journalière',
          campaignId: null,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
          status: 'in_progress',
          progress: 50,
          description: 'Distribution de l’aliment concentré (12h) et vérification eau.'
        },
        {
          _id: 'task-3',
          title: 'Contrôler la clôture Nord',
          campaignId: null,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
          status: 'pending',
          progress: 0,
          description: 'Vérifier les réparations après la tempête du week-end.'
        }
      ]
    }
  })
}
