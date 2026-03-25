import api from './api'

export function createTransaction(payload) {
  return api.post('/reports/transactions', payload)
}

export function getTransactions(params) {
  return api.get('/reports/transactions', { params })
}

export function getTransactionById(id) {
  return api.get(`/reports/transactions/${id}`)
}

export function getFinancialSummary() {
  return api.get('/reports/financial-summary')
}

export function getCampaignFinancial(campaignId) {
  return api.get(`/reports/campaigns/${campaignId}/financial`)
}

export function getCashFlow(campaignId = null, period = 'monthly') {
  return api.get('/reports/cash-flow', { params: { campaignId, period } })
}

export function getExpensesAnalysis() {
  return api.get('/reports/expenses/analysis')
}

export function getCampaignRoi(campaignId) {
  return api.get(`/reports/campaigns/${campaignId}/roi`)
}

export function getCampaignBudgetVsActual(campaignId) {
  return api.get(`/reports/campaigns/${campaignId}/budget-vs-actual`)
}

export function getSalesAnimals() {
  return api.get('/reports/sales/animals')
}

export function getSalesProducts() {
  return api.get('/reports/sales/products')
}

export function getDashboard(params) {
  return api.get('/reports/dashboard', { params })
}

export function getKPIs(params) {
  return api.get('/reports/kpis', { params })
}
