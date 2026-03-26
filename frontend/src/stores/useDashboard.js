import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as reportService from '../services/report.service'
import * as feedService from '../services/feed.service'
import * as healthService from '../services/health.service'

export const useDashboard = defineStore('dashboard', () => {
  const kpis = ref({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    roi: null
  })

  const dashboard = ref({
    financialSummary: null,
    expenseAnalysis: [],
    cashFlow: [],
    alerts: []
  })

  const feedStats = ref({})
  const healthStats = ref({})
  const loading = ref(false)
  const error = ref(null)

  const profitStatus = computed(() => {
    if (kpis.value.netProfit > 0) return 'positive'
    if (kpis.value.netProfit < 0) return 'negative'
    return 'neutral'
  })

  const fetchKPIs = async (campaignId = null) => {
    loading.value = true
    error.value = null
    try {
      const res = await reportService.getKPIs({ campaignId })
      // Traitement des formats diff�rents : { success, data: {...} } ou { ... }
      const payload = res?.data?.data || res?.data || res
      kpis.value = {
        totalRevenue: payload.totalRevenue || 0,
        totalExpenses: payload.totalExpenses || 0,
        netProfit: payload.netProfit || 0,
        profitMargin: payload.profitMargin || 0,
        roi: payload.roi ?? null
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des KPIs'
    } finally {
      loading.value = false
    }
  }

  const fetchDashboard = async (campaignId = null) => {
    loading.value = true
    error.value = null
    try {
      const res = await reportService.getDashboard({ campaignId })
      const payload = res?.data?.data || res?.data || res
      dashboard.value = {
        financialSummary: payload.financialSummary || null,
        expenseAnalysis: payload.expenseAnalysis || [],
        cashFlow: payload.cashFlow || [],
        alerts: payload.alerts || []
      }
      if (payload.feedStats) feedStats.value = payload.feedStats
      if (payload.healthStats) healthStats.value = payload.healthStats
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement du tableau de bord'
    } finally {
      loading.value = false
    }
  }

  const fetchFeedStats = async () => {
    try {
      const res = await feedService.getFeedStatsSummary()
      const payload = res?.data?.data || res?.data || res
      feedStats.value = payload || {}
    } catch (err) {
      console.warn('Feed stats unavailable:', err)
      feedStats.value = {}
    }
  }

  const fetchHealthStats = async () => {
    try {
      const res = await healthService.getHealthStatistics()
      const payload = res?.data?.data || res?.data || res
      healthStats.value = payload || {}
    } catch (err) {
      console.warn('Health stats unavailable:', err)
      healthStats.value = {}
    }
  }

  const fetchAll = async (campaignId = null) => {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchKPIs(campaignId),
        fetchDashboard(campaignId),
        fetchFeedStats(),
        fetchHealthStats()
      ])
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des données du dashboard'
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    kpis.value = {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0,
      roi: null
    }
    dashboard.value = {
      financialSummary: null,
      expenseAnalysis: [],
      cashFlow: [],
      alerts: []
    }
    feedStats.value = {}
    healthStats.value = {}
    loading.value = false
    error.value = null
  }

  return {
    kpis,
    dashboard,
    feedStats,
    healthStats,
    loading,
    error,
    profitStatus,
    fetchKPIs,
    fetchDashboard,
    fetchFeedStats,
    fetchHealthStats,
    fetchAll,
    clear
  }
})
