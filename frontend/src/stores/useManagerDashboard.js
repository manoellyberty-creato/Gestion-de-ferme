import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as managerService from '../services/manager.service'

export const useManagerDashboard = defineStore('managerDashboard', () => {
  // STATE
  const campaigns = ref([])
  const animals = ref([])
  const selectedCampaign = ref(null)
  const campaignStats = ref(null)
  const animalStats = ref(null)
  const campaignFinancial = ref(null)
  const campaignROI = ref(null)
  const operationalAlerts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // COMPUTED
  const activeCampaignsCount = computed(() => 
    campaigns.value.filter(c => c.status === 'active').length
  )
  
  const totalAnimalsCount = computed(() => animals.value.length)
  
  const healthyAnimalsCount = computed(() => 
    animalStats.value?.healthyCount || 0
  )
  
  const sickAnimalsCount = computed(() => 
    animalStats.value?.sickCount || 0
  )
  
  const animalMortalityRate = computed(() => {
    if (!animalStats.value) return 0
    const total = animalStats.value.totalCount || 1
    const dead = animalStats.value.deadCount || 0
    return ((dead / total) * 100).toFixed(2)
  })

  const averageCampaignROI = computed(() => {
    if (!campaignROI.value) return 0
    return campaignROI.value.roi || 0
  })

  const criticalAlerts = computed(() => 
    operationalAlerts.value.filter(a => a.severity === 'critical')
  )

  // ACTIONS
  const fetchCampaigns = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await managerService.getCampaigns()
      campaigns.value = response.data?.data || []
      if (campaigns.value.length > 0 && !selectedCampaign.value) {
        selectedCampaign.value = campaigns.value[0]._id
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des campagnes'
    } finally {
      loading.value = false
    }
  }

  const fetchAnimals = async () => {
    loading.value = true
    error.value = null
    try {
      const params = selectedCampaign.value ? { campaign: selectedCampaign.value } : {}
      const response = await managerService.getAnimals(params)
      animals.value = response.data?.data || []
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des animaux'
    } finally {
      loading.value = false
    }
  }

  const fetchCampaignStats = async (campaignId) => {
    try {
      const response = await managerService.getCampaignStats(campaignId)
      campaignStats.value = response.data?.data || {}
    } catch (err) {
      console.warn('Stats campagne indisponible:', err)
    }
  }

  const fetchAnimalStats = async (campaignId) => {
    try {
      const response = await managerService.getAnimalStats(campaignId)
      animalStats.value = response.data?.data || {}
    } catch (err) {
      console.warn('Stats animaux indisponible:', err)
    }
  }

  const fetchCampaignFinancial = async (campaignId) => {
    try {
      const response = await managerService.getCampaignFinancial(campaignId)
      campaignFinancial.value = response.data?.data || {}
    } catch (err) {
      console.warn('Données financières indisponible:', err)
    }
  }

  const fetchCampaignROI = async (campaignId) => {
    try {
      const response = await managerService.getCampaignROI(campaignId)
      campaignROI.value = response.data?.data || {}
    } catch (err) {
      console.warn('ROI indisponible:', err)
    }
  }

  const fetchOperationalAlerts = async (campaignId) => {
    try {
      const response = await managerService.getOperationalAlerts(campaignId)
      operationalAlerts.value = response.data?.data || []
    } catch (err) {
      console.warn('Alertes opérationnelles indisponible:', err)
      operationalAlerts.value = []
    }
  }

  const selectCampaign = async (campaignId) => {
    selectedCampaign.value = campaignId
    await Promise.all([
      fetchCampaignStats(campaignId),
      fetchAnimalStats(campaignId),
      fetchCampaignFinancial(campaignId),
      fetchCampaignROI(campaignId),
      fetchOperationalAlerts(campaignId),
      fetchAnimals()
    ])
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      await fetchCampaigns()
      if (selectedCampaign.value) {
        await selectCampaign(selectedCampaign.value)
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des données'
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    campaigns.value = []
    animals.value = []
    selectedCampaign.value = null
    campaignStats.value = null
    animalStats.value = null
    campaignFinancial.value = null
    campaignROI.value = null
    operationalAlerts.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    campaigns,
    animals,
    selectedCampaign,
    campaignStats,
    animalStats,
    campaignFinancial,
    campaignROI,
    operationalAlerts,
    loading,
    error,
    // Computed
    activeCampaignsCount,
    totalAnimalsCount,
    healthyAnimalsCount,
    sickAnimalsCount,
    animalMortalityRate,
    averageCampaignROI,
    criticalAlerts,
    // Actions
    fetchCampaigns,
    fetchAnimals,
    fetchCampaignStats,
    fetchAnimalStats,
    fetchCampaignFinancial,
    fetchCampaignROI,
    fetchOperationalAlerts,
    selectCampaign,
    fetchAll,
    clear
  }
})
