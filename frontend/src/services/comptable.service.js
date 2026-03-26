import api from './api'

// Transaction Management
export const getTransactions = (params = {}) => {
  return api.get('/reports/transactions', { params })
}

export const getTransactionById = (id) => {
  return api.get(`/reports/transactions/${id}`)
}

export const createTransaction = (data) => {
  return api.post('/reports/transactions', data)
}

export const updateTransaction = (id, data) => {
  return api.put(`/reports/transactions/${id}`, data)
}

export const deleteTransaction = (id) => {
  return api.delete(`/reports/transactions/${id}`)
}

export const approveTransaction = (id) => {
  return api.post(`/reports/transactions/${id}/approve`)
}

export const rejectTransaction = (id, reason) => {
  return api.post(`/reports/transactions/${id}/reject`, { reason })
}

// Financial Summary & Analysis
export const getFinancialSummary = (startDate, endDate) => {
  return api.get('/reports/financial', { params: { startDate, endDate } })
}

export const getCashFlow = (months = 6) => {
  return api.get('/reports/cashflow', { params: { months } })
}

export const getExpenseBreakdown = (startDate, endDate) => {
  return api.get('/reports/expenses', { params: { startDate, endDate } })
}

export const getRevenueBreakdown = (startDate, endDate) => {
  return api.get('/reports/revenue', { params: { startDate, endDate } })
}

// Reconciliation
export const getReconciliationStatus = (campaignId) => {
  return api.get(`/reports/reconciliation/${campaignId}`)
}

export const reconcileCampaign = (campaignId, data) => {
  return api.post(`/reports/reconciliation/${campaignId}`, data)
}

export const getReconciliationHistory = (campaignId) => {
  return api.get(`/reports/reconciliation/${campaignId}/history`)
}

// Audit Trail
export const getAuditTrail = (params = {}) => {
  return api.get('/reports/audit', { params })
}

export const getAuditTrailByCampaign = (campaignId) => {
  return api.get(`/reports/audit/campaign/${campaignId}`)
}

export const getAuditTrailByUser = (userId) => {
  return api.get(`/reports/audit/user/${userId}`)
}

// Pending Transactions Awaiting Approval
export const getPendingApprovals = () => {
  return api.get('/reports/transactions/pending/approvals')
}

export const getPendingApprovalsCount = () => {
  return api.get('/reports/transactions/pending/count')
}

// Budget & Variance Analysis
export const getBudgetAnalysis = (campaignId) => {
  return api.get(`/reports/budget/${campaignId}`)
}

export const getBudgetVariance = (campaignId) => {
  return api.get(`/reports/budget/${campaignId}/variance`)
}

// Campaign Financial Status
export const getCampaignFinancials = (campaignId) => {
  return api.get(`/campaigns/${campaignId}/financials`)
}

export const getAllCampaignsFinancials = () => {
  return api.get('/campaigns/financials/all')
}

// Export Reports
export const exportTransactionsReport = (format = 'pdf', params = {}) => {
  return api.get('/reports/transactions/export', {
    params: { format, ...params },
    responseType: 'blob'
  })
}

export const exportFinancialReport = (format = 'pdf', startDate, endDate) => {
  return api.get('/reports/financial/export', {
    params: { format, startDate, endDate },
    responseType: 'blob'
  })
}

export const exportAuditReport = (format = 'pdf') => {
  return api.get('/reports/audit/export', {
    params: { format },
    responseType: 'blob'
  })
}

// Dashboard Metrics
export const getComptableDashboardMetrics = () => {
  return api.get('/reports/comptable/metrics')
}

export const getTotalRevenue = (startDate, endDate) => {
  return api.get('/reports/revenue/total', { params: { startDate, endDate } })
}

export const getTotalExpenses = (startDate, endDate) => {
  return api.get('/reports/expenses/total', { params: { startDate, endDate } })
}

export const getNetProfit = (startDate, endDate) => {
  return api.get('/reports/profit/net', { params: { startDate, endDate } })
}

export const getProfitMargin = (startDate, endDate) => {
  return api.get('/reports/profit/margin', { params: { startDate, endDate } })
}
