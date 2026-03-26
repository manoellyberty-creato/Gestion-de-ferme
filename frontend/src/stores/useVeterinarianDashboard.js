import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as veterinarianService from '../services/veterinarian.service'

export const useVeterinarianDashboard = defineStore('veterinarianDashboard', () => {
  // STATE
  const prescriptions = ref([])
  const sickAnimals = ref([])
  const healthProducts = ref([])
  const expiredProducts = ref([])
  const nearExpirationProducts = ref([])
  const healthStatistics = ref(null)
  const healthAlerts = ref([])
  const selectedCampaign = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // COMPUTED
  const activePrescriptionsCount = computed(() =>
    prescriptions.value.filter(p => p.status === 'active').length
  )

  const completedPrescriptionsCount = computed(() =>
    prescriptions.value.filter(p => p.status === 'completed').length
  )

  const sickAnimalsCount = computed(() => sickAnimals.value.length)

  const totalHealthAlerts = computed(() => healthAlerts.value.length)

  const criticalAlerts = computed(() =>
    healthAlerts.value.filter(a => a.severity === 'critical')
  )

  const productsNeedingAttention = computed(() =>
    (expiredProducts.value?.length || 0) + (nearExpirationProducts.value?.length || 0)
  )

  const prescriptionsByStatus = computed(() => ({
    active: activePrescriptionsCount.value,
    completed: completedPrescriptionsCount.value,
    pending: prescriptions.value.filter(p => p.status === 'pending').length
  }))

  // ACTIONS
  const fetchPrescriptions = async (campaignId = null) => {
    loading.value = true
    error.value = null
    try {
      const params = campaignId ? { campaign: campaignId } : {}
      const response = await veterinarianService.getPrescriptions(params)
      prescriptions.value = response.data?.data || []
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des prescriptions'
      console.warn('Prescriptions:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSickAnimals = async (campaignId) => {
    try {
      const response = await veterinarianService.getSickAnimals(campaignId)
      sickAnimals.value = response.data?.data || []
    } catch (err) {
      console.warn('Animaux malades:', err)
      sickAnimals.value = []
    }
  }

  const fetchHealthProducts = async () => {
    try {
      const response = await veterinarianService.getHealthProducts()
      healthProducts.value = response.data?.data || []
    } catch (err) {
      console.warn('Produits santé:', err)
      healthProducts.value = []
    }
  }

  const fetchProductAlerts = async () => {
    try {
      const [expired, nearExpiry] = await Promise.all([
        veterinarianService.getExpiredProducts(),
        veterinarianService.getNearExpirationProducts()
      ])
      expiredProducts.value = expired.data?.data || []
      nearExpirationProducts.value = nearExpiry.data?.data || []
    } catch (err) {
      console.warn('Alertes produits:', err)
      expiredProducts.value = []
      nearExpirationProducts.value = []
    }
  }

  const fetchHealthStatistics = async (campaignId) => {
    try {
      const response = await veterinarianService.getHealthStatistics(campaignId)
      healthStatistics.value = response.data?.data || {}
    } catch (err) {
      console.warn('Statistiques santé:', err)
      healthStatistics.value = {}
    }
  }

  const fetchHealthAlerts = async () => {
    try {
      const response = await veterinarianService.getHealthAlerts()
      healthAlerts.value = response.data?.data || []
    } catch (err) {
      console.warn('Alertes santé:', err)
      healthAlerts.value = []
    }
  }

  const createPrescription = async (data) => {
    loading.value = true
    error.value = null
    try {
      await veterinarianService.createPrescription(data)
      await fetchPrescriptions(selectedCampaign.value)
    } catch (err) {
      error.value = err.message || 'Erreur lors de la création de la prescription'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePrescription = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await veterinarianService.updatePrescription(id, data)
      await fetchPrescriptions(selectedCampaign.value)
    } catch (err) {
      error.value = err.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addAdministration = async (prescriptionId, data) => {
    loading.value = true
    error.value = null
    try {
      await veterinarianService.addAdministration(prescriptionId, data)
      await fetchPrescriptions(selectedCampaign.value)
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'ajout de l\'administration'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async (campaignId) => {
    selectedCampaign.value = campaignId
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchPrescriptions(campaignId),
        fetchSickAnimals(campaignId),
        fetchHealthProducts(),
        fetchProductAlerts(),
        fetchHealthStatistics(campaignId),
        fetchHealthAlerts()
      ])
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des données'
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    prescriptions.value = []
    sickAnimals.value = []
    healthProducts.value = []
    expiredProducts.value = []
    nearExpirationProducts.value = []
    healthStatistics.value = null
    healthAlerts.value = []
    selectedCampaign.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    prescriptions,
    sickAnimals,
    healthProducts,
    expiredProducts,
    nearExpirationProducts,
    healthStatistics,
    healthAlerts,
    selectedCampaign,
    loading,
    error,
    // Computed
    activePrescriptionsCount,
    completedPrescriptionsCount,
    sickAnimalsCount,
    totalHealthAlerts,
    criticalAlerts,
    productsNeedingAttention,
    prescriptionsByStatus,
    // Actions
    fetchPrescriptions,
    fetchSickAnimals,
    fetchHealthProducts,
    fetchProductAlerts,
    fetchHealthStatistics,
    fetchHealthAlerts,
    createPrescription,
    updatePrescription,
    addAdministration,
    fetchAll,
    clear
  }
})
