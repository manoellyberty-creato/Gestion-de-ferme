import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as reportService from '../services/report.service'

export const useReport = defineStore('report', () => {
  // STATE
  const transactions = ref([])
  const financialSummary = ref(null)
  const cashFlowData = ref(null)
  const expensesAnalysis = ref(null)
  const campaignFinancial = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const currentFilters = ref({})
  const pagination = ref({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  })

  // COMPUTED
  const transactionCount = computed(() => transactions.value.length)
  const totalIncome = computed(() => financialSummary.value?.totalIncome || 0)
  const totalExpense = computed(() => financialSummary.value?.totalExpense || 0)
  const netProfit = computed(() => financialSummary.value?.netProfit || 0)
  const profitMargin = computed(() => financialSummary.value?.profitMargin || 0)

  // ACTIONS - TRANSACTIONS
  const fetchTransactions = async (filters = {}, page = 1) => {
    loading.value = true
    error.value = null
    try {
      currentFilters.value = filters
      pagination.value.page = page
      const response = await reportService.getTransactions({
        ...filters,
        page,
        limit: pagination.value.limit
      })
      if (response.docs) {
        transactions.value = response.docs
        pagination.value = {
          page: response.page,
          limit: response.limit,
          total: response.totalDocs,
          pages: response.totalPages
        }
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des transactions'
      console.error(error.value, err)
    } finally {
      loading.value = false
    }
  }

  const createTransaction = async (data) => {
    loading.value = true
    error.value = null
    try {
      await reportService.createTransaction(data)
      await fetchTransactions(currentFilters.value)
    } catch (err) {
      error.value = err.message || 'Erreur lors de la création de la transaction'
      console.error(error.value, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await reportService.updateTransaction(id, data)
      await fetchTransactions(currentFilters.value)
    } catch (err) {
      error.value = err.message || 'Erreur lors de la mise à jour de la transaction'
      console.error(error.value, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    loading.value = true
    error.value = null
    try {
      await reportService.deleteTransaction(id)
      await fetchTransactions(currentFilters.value)
    } catch (err) {
      error.value = err.message || 'Erreur lors de la suppression de la transaction'
      console.error(error.value, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ACTIONS - FINANCIAL REPORTS
  const fetchFinancialSummary = async (campaignId = null, startDate = null, endDate = null) => {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getFinancialSummary()
      financialSummary.value = response.data || response
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération du résumé financier'
      console.error(error.value, err)
    } finally {
      loading.value = false
    }
  }

  const fetchCampaignFinancial = async (campaignId) => {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getCampaignFinancial(campaignId)
      campaignFinancial.value = response.data || response
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération du rapport de campagne'
      console.error(error.value, err)
    } finally {
      loading.value = false
    }
  }

  const fetchCashFlow = async (campaignId = null, period = 'monthly') => {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getCashFlow()
      cashFlowData.value = response.data || response
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération du flux de trésorerie'
      console.error(error.value, err)
    } finally {
      loading.value = false
    }
  }

  const fetchExpensesAnalysis = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getExpensesAnalysis()
      expensesAnalysis.value = response.data || response
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération de l\'analyse des dépenses'
      console.error(error.value, err)
    } finally {
      loading.value = false
    }
  }

  // ACTIONS - EXPORT
  const exportTransactions = async (format = 'csv') => {
    error.value = null
    try {
      const response = await reportService.exportTransactions(format, currentFilters.value)
      // Déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `transactions.${format}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      error.value = err.message || `Erreur lors de l'export en ${format}`
      console.error(error.value, err)
      throw err
    }
  }

  // RESET
  const reset = () => {
    transactions.value = []
    financialSummary.value = null
    cashFlowData.value = null
    expensesAnalysis.value = null
    campaignFinancial.value = null
    loading.value = false
    error.value = null
    currentFilters.value = {}
    pagination.value = {
      page: 1,
      limit: 50,
      total: 0,
      pages: 0
    }
  }

  return {
    // State
    transactions,
    financialSummary,
    cashFlowData,
    expensesAnalysis,
    campaignFinancial,
    loading,
    error,
    currentFilters,
    pagination,
    // Computed
    transactionCount,
    totalIncome,
    totalExpense,
    netProfit,
    profitMargin,
    // Actions
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchFinancialSummary,
    fetchCampaignFinancial,
    fetchCashFlow,
    fetchExpensesAnalysis,
    exportTransactions,
    reset
  }
})
