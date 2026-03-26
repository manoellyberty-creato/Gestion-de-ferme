import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAlerts, markAsRead, generateAutomatedAlerts, createAlert, resolveAlert } from '@/services/alert.service'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Filtres
  const filters = ref({
    status: 'all', // all, active, resolved
    level: 'all', // all, info, warning, danger
    type: 'all', // all, mortality, weight_loss, disease
    read: 'all' // all, read, unread
  })

  // Computed pour les alertes filtrées
  const filteredAlerts = computed(() => {
    return alerts.value.filter(alert => {
      if (filters.value.status !== 'all' && alert.status !== filters.value.status) return false
      if (filters.value.level !== 'all' && alert.level !== filters.value.level) return false
      if (filters.value.type !== 'all' && alert.type !== filters.value.type) return false
      if (filters.value.read !== 'all') {
        const isRead = alert.read === true
        if (filters.value.read === 'read' && !isRead) return false
        if (filters.value.read === 'unread' && isRead) return false
      }
      return true
    })
  })

  // Statistiques
  const stats = computed(() => {
    const total = alerts.value.length
    const active = alerts.value.filter(a => a.status === 'active').length
    const resolved = alerts.value.filter(a => a.status === 'resolved').length
    const unread = alerts.value.filter(a => !a.read).length
    const byLevel = {
      danger: alerts.value.filter(a => a.level === 'danger').length,
      warning: alerts.value.filter(a => a.level === 'warning').length,
      info: alerts.value.filter(a => a.level === 'info').length
    }

    return { total, active, resolved, unread, byLevel }
  })

  // Actions
  const fetchAlerts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await getAlerts()
      alerts.value = response.data.data || []
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des alertes'
      console.error('Erreur fetch alerts:', err)
    } finally {
      loading.value = false
    }
  }

  const markAlertAsRead = async (alertId) => {
    try {
      await markAsRead(alertId)
      const alert = alerts.value.find(a => a._id === alertId)
      if (alert) {
        alert.read = true
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du marquage comme lu'
      throw err
    }
  }

  const resolveAlertAction = async (alertId) => {
    try {
      const response = await resolveAlert(alertId)
      const alert = alerts.value.find(a => a._id === alertId)
      if (alert) {
        alert.status = 'resolved'
        alert.resolvedAt = new Date().toISOString()
      }
      return response.data
    } catch (err) {
      error.value = err.message || 'Erreur lors de la résolution'
      throw err
    }
  }

  const generateAlerts = async (campaignId) => {
    try {
      const response = await generateAutomatedAlerts({ campaignId })
      // Recharger les alertes après génération
      await fetchAlerts()
      return response.data
    } catch (err) {
      error.value = err.message || 'Erreur lors de la génération des alertes'
      throw err
    }
  }

  const createNewAlert = async (alertData) => {
    try {
      const response = await createAlert(alertData)
      alerts.value.unshift(response.data.data)
      return response.data
    } catch (err) {
      error.value = err.message || 'Erreur lors de la création de l\'alerte'
      throw err
    }
  }

  const setFilter = (key, value) => {
    filters.value[key] = value
  }

  const clearFilters = () => {
    filters.value = {
      status: 'all',
      level: 'all',
      type: 'all',
      read: 'all'
    }
  }

  return {
    // State
    alerts,
    loading,
    error,
    filters,

    // Computed
    filteredAlerts,
    stats,

    // Actions
    fetchAlerts,
    markAlertAsRead,
    resolveAlertAction,
    generateAlerts,
    createNewAlert,
    setFilter,
    clearFilters
  }
})