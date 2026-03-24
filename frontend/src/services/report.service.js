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

export function getCashFlow() {
  return api.get('/reports/cash-flow')
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

export function getDashboard() {
  return api.get('/reports/dashboard')
}

export function getKpis() {
  return api.get('/reports/kpis')
}
