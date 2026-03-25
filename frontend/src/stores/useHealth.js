import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as healthService from '../services/health.service'

export const useHealth = defineStore('health', () => {
  // State
  const products = ref([])
  const prescriptions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedProduct = ref(null)
  const selectedPrescription = ref(null)

  // Computed
  const productCount = computed(() => products.value.length)
  const prescriptionCount = computed(() => prescriptions.value.length)

  // ------- PRODUCTS -------

  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.getProducts(params)
      products.value = Array.isArray(response.data) ? response.data : response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des produits'
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.getProductById(id)
      selectedProduct.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du produit'
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.createProduct(payload)
      products.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.updateProduct(id, payload)
      const index = products.value.findIndex(p => p._id === id)
      if (index !== -1) {
        products.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id) => {
    loading.value = true
    error.value = null
    try {
      await healthService.deleteProduct(id)
      products.value = products.value.filter(p => p._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ------- PRESCRIPTIONS -------

  const fetchPrescriptions = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.getPrescriptions(params)
      prescriptions.value = Array.isArray(response.data) ? response.data : response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des prescriptions'
    } finally {
      loading.value = false
    }
  }

  const fetchPrescriptionById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.getPrescriptionById(id)
      selectedPrescription.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement de la prescription'
    } finally {
      loading.value = false
    }
  }

  const createPrescription = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.createPrescription(payload)
      prescriptions.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePrescription = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await healthService.updatePrescription(id, payload)
      const index = prescriptions.value.findIndex(p => p._id === id)
      if (index !== -1) {
        prescriptions.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePrescription = async (id) => {
    loading.value = true
    error.value = null
    try {
      await healthService.deletePrescription(id)
      prescriptions.value = prescriptions.value.filter(p => p._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addAdministration = async (prescriptionId, payload) => {
    error.value = null
    try {
      const response = await healthService.addAdministration(prescriptionId, payload)
      const index = prescriptions.value.findIndex(p => p._id === prescriptionId)
      if (index !== -1) {
        prescriptions.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'ajout'
      throw err
    }
  }

  const fetchAnimalPrescriptions = async (animalId) => {
    error.value = null
    try {
      const response = await healthService.getAnimalPrescriptions(animalId)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement'
      throw err
    }
  }

  const fetchCampaignPrescriptions = async (campaignId) => {
    error.value = null
    try {
      const response = await healthService.getCampaignPrescriptions(campaignId)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement'
      throw err
    }
  }

  const fetchStats = async () => {
    error.value = null
    try {
      const response = await healthService.getHealthStatistics()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la récupération des stats'
      throw err
    }
  }

  const fetchAlerts = async () => {
    error.value = null
    try {
      const response = await healthService.getHealthAlerts()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des alertes'
      throw err
    }
  }

  return {
    // State
    products,
    prescriptions,
    loading,
    error,
    selectedProduct,
    selectedPrescription,
    // Computed
    productCount,
    prescriptionCount,
    // Products actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // Prescriptions actions
    fetchPrescriptions,
    fetchPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription,
    addAdministration,
    fetchAnimalPrescriptions,
    fetchCampaignPrescriptions,
    // Stats
    fetchStats,
    fetchAlerts,
  }
})
