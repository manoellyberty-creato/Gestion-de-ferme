import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as comptableService from '../services/comptable.service'

export const useComptableDashboard = defineStore('comptableDashboard', () => {
  // STATE
  const transactions = ref([])
  const pendingApprovals = ref([])
  const financialSummary = ref(null)
  const cashFlow = ref(null)
  const expenseBreakdown = ref(null)
  const revenueBreakdown = ref(null)
  const auditTrail = ref([])
  const reconciliationStatus = ref(null)
  const budgetAnalysis = ref(null)
  const selectedCampaign = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const dateRange = ref({ startDate: null, endDate: null })

  // COMPUTED
  const totalRevenue = computed(() => financialSummary.value?.revenue || 0)

  const totalExpenses = computed(() => financialSummary.value?.expenses || 0)

  const netProfit = computed(() => financialSummary.value?.netProfit || 0)

  const profitMargin = computed(() => {
    if (totalRevenue.value === 0) return 0
    return ((netProfit.value / totalRevenue.value) * 100).toFixed(2)
  })

  const pendingApprovalsCount = computed(() => pendingApprovals.value.length)

  const approvedCount = computed(() =>
    transactions.value.filter(t => t.status === 'approved').length
  )

  const rejectedCount = computed(() =>
    transactions.value.filter(t => t.status === 'rejected').length
  )

  const totalTransactions = computed(() => transactions.value.length)

  const averageTransactionValue = computed(() => {
    if (totalTransactions.value === 0) return 0
    const sum = transactions.value.reduce((acc, t) => acc + (t.amount || 0), 0)
    return (sum / totalTransactions.value).toFixed(2)
  })

  const criticalAuditItems = computed(() =>
    auditTrail.value.filter(item => item.severity === 'critical').slice(0, 5)
  )

  const transactionsByStatus = computed(() => ({
    approved: approvedCount.value,
    rejected: rejectedCount.value,
    pending: pendingApprovalsCount.value,
    total: totalTransactions.value
  }))

  const reconciliationProgress = computed(() => {
    if (!reconciliationStatus.value) return 0
    return reconciliationStatus.value.percentage || 0
  })

  const budgetPerformance = computed(() => {
    if (!budgetAnalysis.value) return null
    const variance = budgetAnalysis.value.variance || 0
    const budget = budgetAnalysis.value.budget || 0
    return {
      budget,
      spent: budgetAnalysis.value.spent || 0,
      remaining: Math.max(0, budget - (budgetAnalysis.value.spent || 0)),
      variance,
      variancePercent: budget !== 0 ? ((variance / budget) * 100).toFixed(2) : 0
    }
  })

  const monthlyTrendData = computed(() => {
    if (!cashFlow.value) return []
    return cashFlow.value.months || []
  })

  // ACTIONS
  const fetchTransactions = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await comptableService.getTransactions(params)
      transactions.value = response.data?.data || []
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des transactions'
      console.warn('Transactions:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPendingApprovals = async () => {
    try {
      const response = await comptableService.getPendingApprovals()
      pendingApprovals.value = response.data?.data || []
    } catch (err) {
      console.warn('Pending approvals:', err)
      pendingApprovals.value = []
    }
  }

  const fetchFinancialSummary = async (startDate, endDate) => {
    try {
      const response = await comptableService.getFinancialSummary(startDate, endDate)
      financialSummary.value = response.data?.data || {}
    } catch (err) {
      console.warn('Financial summary:', err)
      financialSummary.value = {}
    }
  }

  const fetchCashFlow = async (months = 6) => {
    try {
      const response = await comptableService.getCashFlow(months)
      cashFlow.value = response.data?.data || {}
    } catch (err) {
      console.warn('Cash flow:', err)
      cashFlow.value = {}
    }
  }

  const fetchExpenseBreakdown = async (startDate, endDate) => {
    try {
      const response = await comptableService.getExpenseBreakdown(startDate, endDate)
      expenseBreakdown.value = response.data?.data || {}
    } catch (err) {
      console.warn('Expense breakdown:', err)
      expenseBreakdown.value = {}
    }
  }

  const fetchRevenueBreakdown = async (startDate, endDate) => {
    try {
      const response = await comptableService.getRevenueBreakdown(startDate, endDate)
      revenueBreakdown.value = response.data?.data || {}
    } catch (err) {
      console.warn('Revenue breakdown:', err)
      revenueBreakdown.value = {}
    }
  }

  const fetchAuditTrail = async (params = {}) => {
    try {
      const response = await comptableService.getAuditTrail(params)
      auditTrail.value = response.data?.data || []
    } catch (err) {
      console.warn('Audit trail:', err)
      auditTrail.value = []
    }
  }

  const fetchReconciliationStatus = async (campaignId) => {
    try {
      const response = await comptableService.getReconciliationStatus(campaignId)
      reconciliationStatus.value = response.data?.data || {}
    } catch (err) {
      console.warn('Reconciliation status:', err)
      reconciliationStatus.value = {}
    }
  }

  const fetchBudgetAnalysis = async (campaignId) => {
    try {
      const response = await comptableService.getBudgetAnalysis(campaignId)
      budgetAnalysis.value = response.data?.data || {}
    } catch (err) {
      console.warn('Budget analysis:', err)
      budgetAnalysis.value = {}
    }
  }

  const approveTransaction = async (transactionId) => {
    loading.value = true
    error.value = null
    try {
      await comptableService.approveTransaction(transactionId)
      await fetchTransactions()
      await fetchPendingApprovals()
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'approbation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const rejectTransaction = async (transactionId, reason) => {
    loading.value = true
    error.value = null
    try {
      await comptableService.rejectTransaction(transactionId, reason)
      await fetchTransactions()
      await fetchPendingApprovals()
    } catch (err) {
      error.value = err.message || 'Erreur lors du rejet'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTransaction = async (data) => {
    loading.value = true
    error.value = null
    try {
      await comptableService.createTransaction(data)
      await fetchTransactions()
    } catch (err) {
      error.value = err.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await comptableService.updateTransaction(id, data)
      await fetchTransactions()
    } catch (err) {
      error.value = err.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const reconcileCampaign = async (campaignId, data) => {
    loading.value = true
    error.value = null
    try {
      await comptableService.reconcileCampaign(campaignId, data)
      await fetchReconciliationStatus(campaignId)
    } catch (err) {
      error.value = err.message || 'Erreur lors de la réconciliation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async (campaignId, startDate, endDate) => {
    selectedCampaign.value = campaignId
    dateRange.value = { startDate, endDate }
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchTransactions({ campaign: campaignId }),
        fetchPendingApprovals(),
        fetchFinancialSummary(startDate, endDate),
        fetchCashFlow(),
        fetchExpenseBreakdown(startDate, endDate),
        fetchRevenueBreakdown(startDate, endDate),
        fetchAuditTrail(),
        fetchBudgetAnalysis(campaignId),
        fetchReconciliationStatus(campaignId)
      ])
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des données'
    } finally {
      loading.value = false
    }
  }

  const exportTransactionsReport = async (format = 'pdf') => {
    try {
      const response = await comptableService.exportTransactionsReport(format, {
        campaign: selectedCampaign.value
      })
      return response
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'export'
      throw err
    }
  }

  const exportFinancialReport = async (format = 'pdf') => {
    try {
      const response = await comptableService.exportFinancialReport(
        format,
        dateRange.value.startDate,
        dateRange.value.endDate
      )
      return response
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'export'
      throw err
    }
  }

  const clear = () => {
    transactions.value = []
    pendingApprovals.value = []
    financialSummary.value = null
    cashFlow.value = null
    expenseBreakdown.value = null
    revenueBreakdown.value = null
    auditTrail.value = []
    reconciliationStatus.value = null
    budgetAnalysis.value = null
    selectedCampaign.value = null
    loading.value = false
    error.value = null
    dateRange.value = { startDate: null, endDate: null }
  }

  return {
    // State
    transactions,
    pendingApprovals,
    financialSummary,
    cashFlow,
    expenseBreakdown,
    revenueBreakdown,
    auditTrail,
    reconciliationStatus,
    budgetAnalysis,
    selectedCampaign,
    loading,
    error,
    dateRange,
    // Computed
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    pendingApprovalsCount,
    approvedCount,
    rejectedCount,
    totalTransactions,
    averageTransactionValue,
    criticalAuditItems,
    transactionsByStatus,
    reconciliationProgress,
    budgetPerformance,
    monthlyTrendData,
    // Actions
    fetchTransactions,
    fetchPendingApprovals,
    fetchFinancialSummary,
    fetchCashFlow,
    fetchExpenseBreakdown,
    fetchRevenueBreakdown,
    fetchAuditTrail,
    fetchReconciliationStatus,
    fetchBudgetAnalysis,
    approveTransaction,
    rejectTransaction,
    createTransaction,
    updateTransaction,
    reconcileCampaign,
    fetchAll,
    exportTransactionsReport,
    exportFinancialReport,
    clear
  }
})
