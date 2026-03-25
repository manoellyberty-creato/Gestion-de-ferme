import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as feedService from '../services/feed.service'

export const useFeed = defineStore('feed', () => {
  // State
  const feeds = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedFeed = ref(null)

  // Computed
  const feedCount = computed(() => feeds.value.length)

  // Actions
  const fetchFeeds = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await feedService.getFeeds(params)
      feeds.value = Array.isArray(response.data) ? response.data : response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des feeds'
    } finally {
      loading.value = false
    }
  }

  const fetchFeedById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await feedService.getFeedById(id)
      selectedFeed.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du feed'
    } finally {
      loading.value = false
    }
  }

  const createFeed = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await feedService.createFeed(payload)
      feeds.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du feed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFeed = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await feedService.updateFeed(id, payload)
      const index = feeds.value.findIndex(f => f._id === id)
      if (index !== -1) {
        feeds.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteFeed = async (id) => {
    loading.value = true
    error.value = null
    try {
      await feedService.deleteFeed(id)
      feeds.value = feeds.value.filter(f => f._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStock = async (id, quantity) => {
    error.value = null
    try {
      const response = await feedService.updateStock(id, quantity)
      const index = feeds.value.findIndex(f => f._id === id)
      if (index !== -1) {
        feeds.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour du stock'
      throw err
    }
  }

  const deactivateFeed = async (id) => {
    error.value = null
    try {
      const response = await feedService.deactivateFeed(id)
      const index = feeds.value.findIndex(f => f._id === id)
      if (index !== -1) {
        feeds.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la désactivation'
      throw err
    }
  }

  const fetchStats = async () => {
    error.value = null
    try {
      const response = await feedService.getFeedStatsSummary()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la récupération des stats'
      throw err
    }
  }

  const fetchLowStockAlerts = async () => {
    error.value = null
    try {
      const response = await feedService.getLowStockAlerts()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la récupération des alertes'
      throw err
    }
  }

  const searchFeeds = async (query) => {
    error.value = null
    try {
      const response = await feedService.searchFeed(query)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la recherche'
      throw err
    }
  }

  return {
    // State
    feeds,
    loading,
    error,
    selectedFeed,
    // Computed
    feedCount,
    // Actions
    fetchFeeds,
    fetchFeedById,
    createFeed,
    updateFeed,
    deleteFeed,
    updateStock,
    deactivateFeed,
    fetchStats,
    fetchLowStockAlerts,
    searchFeeds,
  }
})
