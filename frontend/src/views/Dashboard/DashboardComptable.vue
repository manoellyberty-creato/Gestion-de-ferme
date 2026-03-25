<script setup>
import { ref, computed, onMounted } from 'vue'
import { useComptableDashboard } from '../../stores/useComptableDashboard'
import TransactionApprovalCard from '../../components/comptable/TransactionApprovalCard.vue'
import FinancialMetricCard from '../../components/comptable/FinancialMetricCard.vue'
import AuditTrailItem from '../../components/comptable/AuditTrailItem.vue'
import BudgetVarianceCard from '../../components/comptable/BudgetVarianceCard.vue'

const dashboardStore = useComptableDashboard()

// State
const selectedCampaignId = ref('')
const activeTab = ref('approvals')
const selectedTransactionStatus = ref('Toutes')
const dateRange = ref({
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
})
const availableCampaigns = ref([])
const selectedCampaign = ref(null)

// Tab definitions
const tabs = [
  { id: 'approvals', label: ' Approbations' },
  { id: 'transactions', label: ' Transactions' },
  { id: 'reports', label: ' Rapports' },
  { id: 'budget', label: ' Budget' },
  { id: 'audit', label: ' Audit' }
]

// Computed
const hasDateRange = computed(() => dateRange.value.startDate && dateRange.value.endDate)

const periodLabel = computed(() => {
  if (hasDateRange.value) {
    return `${new Date(dateRange.value.startDate).toLocaleDateString('fr-FR')} - ${new Date(dateRange.value.endDate).toLocaleDateString('fr-FR')}`
  }
  return 'N/A'
})

const filteredTransactions = computed(() => {
  const transactions = dashboardStore.transactions
  if (selectedTransactionStatus.value === 'Toutes') return transactions
  if (selectedTransactionStatus.value === 'Approuvées')
    return transactions.filter(t => t.status === 'approved')
  if (selectedTransactionStatus.value === 'Rejetées')
    return transactions.filter(t => t.status === 'rejected')
  return transactions
})

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

// Methods
const handleLoadData = async () => {
  if (!selectedCampaignId.value && !hasDateRange.value) {
    alert('Veuillez sélectionner une campagne ou une plage de dates')
    return
  }

  const campaignId = selectedCampaignId.value || null
  await dashboardStore.fetchAll(campaignId, dateRange.value.startDate, dateRange.value.endDate)

  if (selectedCampaignId.value) {
    selectedCampaign.value = availableCampaigns.value.find(c => c._id === selectedCampaignId.value)
  }

  activeTab.value = 'approvals'
}

const approveTransaction = async (transaction) => {
  try {
    await dashboardStore.approveTransaction(transaction._id)
    console.log('Transaction approved:', transaction._id)
  } catch (err) {
    console.error('Error approving transaction:', err)
  }
}

const showRejectModal = (transaction) => {
  console.log('Show reject modal for:', transaction)
  // TODO: Implement reject modal
}

const showTransactionDetails = (transaction) => {
  console.log('Show transaction details:', transaction)
}

const reconcileBudget = async () => {
  console.log('Reconcile budget for campaign:', selectedCampaignId.value)
  // TODO: Implement reconciliation
}

const exportFinancialReport = async () => {
  try {
    const response = await dashboardStore.exportFinancialReport('pdf')
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'financial-report.pdf')
    document.body.appendChild(link)
    link.click()
  } catch (err) {
    console.error('Error exporting report:', err)
  }
}

const exportAuditReport = async () => {
  try {
    const response = await dashboardStore.exportAuditReport('pdf')
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'audit-report.pdf')
    document.body.appendChild(link)
    link.click()
  } catch (err) {
    console.error('Error exporting audit report:', err)
  }
}

// Fetch available campaigns on mount
onMounted(async () => {
  try {
    // TODO: Fetch campaigns from backend
    availableCampaigns.value = []
  } catch (err) {
    console.error('Error fetching campaigns:', err)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
         Dashboard Comptable
      </h1>
      <p class="text-gray-600">Gestion financière, audits et réconciliations</p>
    </div>

    <!-- Date Range & Campaign Selector -->
    <div class="card bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Campagne</label>
          <select
            v-model="selectedCampaignId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">-- Toutes les campagnes --</option>
            <option v-for="campaign in availableCampaigns" :key="campaign._id" :value="campaign._id">
              {{ campaign.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Depuis</label>
          <input
            v-model="dateRange.startDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Jusqu'à</label>
          <input
            v-model="dateRange.endDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          @click="handleLoadData"
          class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
        >
          📊 Charger
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.loading" class="text-center py-12">
      <p class="text-gray-600">Chargement des données...</p>
      <div class="mt-4 flex justify-center">
        <div class="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="dashboardStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-900 font-semibold">⚠️ Erreur</p>
      <p class="text-red-700">{{ dashboardStore.error }}</p>
    </div>

    <!-- Pending Approvals Alert -->
    <div v-if="dashboardStore.pendingApprovalsCount > 0" class="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
      <p class="font-semibold text-yellow-900 mb-2">⏳ {{ dashboardStore.pendingApprovalsCount }} Transaction(s) en attente d'approbation</p>
      <p class="text-sm text-yellow-800">Veuillez examiner et approuver les transactions en cours de de traitement</p>
    </div>

    <!-- KPI Cards -->
    <div v-if="selectedCampaignId || hasDateRange" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Revenue KPI -->
      <FinancialMetricCard
        label="Revenu Total"
        icon="📊"
        :value="dashboardStore.totalRevenue"
        type="revenue"
        :period="periodLabel"
        :details="`Transactions: ${dashboardStore.transactionsByStatus.total}`"
      />

      <!-- Expenses KPI -->
      <FinancialMetricCard
        label="Dépenses Totales"
        icon="💸"
        :value="dashboardStore.totalExpenses"
        type="expense"
        :period="periodLabel"
      />

      <!-- Profit KPI -->
      <FinancialMetricCard
        label="Bénéfice Net"
        icon="📈"
        :value="dashboardStore.netProfit"
        type="profit"
        :period="periodLabel"
      />

      <!-- Margin KPI -->
      <FinancialMetricCard
        label="Marge Bénéficiaire"
        icon="📉"
        :value="dashboardStore.profitMargin"
        type="margin"
        :period="periodLabel"
        :details="`${dashboardStore.profitMargin}%`"
      />
    </div>

    <!-- Tabs Section -->
    <div v-if="selectedCampaignId || hasDateRange" class="space-y-6">
      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow-md border-b border-gray-200">
        <div class="flex border-b border-gray-200 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-3 font-medium transition whitespace-nowrap"
            :class="
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            "
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Pending Approvals Tab -->
      <div v-if="activeTab === 'approvals'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">En Attente d'Approbation</h2>
          <span class="px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-sm font-semibold">
            {{ dashboardStore.pendingApprovalsCount }}
          </span>
        </div>

        <div v-if="dashboardStore.pendingApprovals.length === 0" class="text-center py-12">
          <p class="text-gray-600">Aucune transaction en attente</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TransactionApprovalCard
            v-for="transaction in dashboardStore.pendingApprovals"
            :key="transaction._id"
            :transaction="transaction"
            @approve="approveTransaction(transaction)"
            @reject="showRejectModal(transaction)"
            @view-details="showTransactionDetails(transaction)"
          />
        </div>
      </div>

      <!-- Transactions Tab -->
      <div v-if="activeTab === 'transactions'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Transaction Management</h2>
          <div class="text-sm text-gray-600">
            Total: <span class="font-bold text-gray-900">{{ dashboardStore.transactionsByStatus.total }}</span>
          </div>
        </div>

        <!-- Filter/Tabs for Transaction Status -->
        <div class="flex gap-2 justify-center">
          <button
            v-for="status in ['Toutes', 'Approuvées', 'Rejetées']"
            :key="status"
            @click="selectedTransactionStatus = status"
            class="px-4 py-2 rounded-lg font-medium transition text-sm"
            :class="
              selectedTransactionStatus === status
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            "
          >
            {{ status }}
          </button>
        </div>

        <div v-if="filteredTransactions.length === 0" class="text-center py-12">
          <p class="text-gray-600">Aucune transaction</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TransactionApprovalCard
            v-for="transaction in filteredTransactions"
            :key="transaction._id"
            :transaction="transaction"
            @approve="approveTransaction(transaction)"
            @reject="showRejectModal(transaction)"
            @view-details="showTransactionDetails(transaction)"
          />
        </div>
      </div>

      <!-- Financial Reports Tab -->
      <div v-if="activeTab === 'reports'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Rapports Financiers</h2>
          <button
            @click="exportFinancialReport"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm"
          >
            📥 Exporter PDF
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p class="text-sm text-gray-600 mb-2">Revenu</p>
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(dashboardStore.totalRevenue) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <p class="text-sm text-gray-600 mb-2">Dépenses</p>
            <p class="text-3xl font-bold text-red-600">{{ formatCurrency(dashboardStore.totalExpenses) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p class="text-sm text-gray-600 mb-2">Bénéfice Net</p>
            <p class="text-3xl font-bold text-blue-600">{{ formatCurrency(dashboardStore.netProfit) }}</p>
          </div>
        </div>

        <!-- Monthly Trend (placeholder) -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Tendance Mensuelle</h3>
          <p class="text-gray-600 text-center py-8">📊 Graphique de tendance (à implémenter)</p>
        </div>
      </div>

      <!-- Budget Analysis Tab -->
      <div v-if="activeTab === 'budget'" class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900">Analyse du Budget</h2>

        <div v-if="dashboardStore.budgetPerformance">
          <BudgetVarianceCard
            :budget="dashboardStore.budgetPerformance.budget"
            :spent="dashboardStore.budgetPerformance.spent"
            :campaign-name="selectedCampaign?.name || 'N/A'"
            @reconcile="reconcileBudget"
          />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-600">Données de budget non disponibles</p>
        </div>
      </div>

      <!-- Audit Trail Tab -->
      <div v-if="activeTab === 'audit'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Piste d'Audit</h2>
          <button
            @click="exportAuditReport"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm"
          >
            📥 Exporter
          </button>
        </div>

        <div v-if="dashboardStore.auditTrail.length === 0" class="text-center py-12">
          <p class="text-gray-600">Aucune entrée d'audit</p>
        </div>

        <div v-else class="bg-white rounded-lg shadow-md p-6">
          <AuditTrailItem
            v-for="(item, idx) in dashboardStore.auditTrail"
            :key="item._id"
            :item="item"
            :is-last="idx === dashboardStore.auditTrail.length - 1"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <p class="text-gray-600 text-lg">Sélectionnez une campagne ou une plage de dates pour commencer</p>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>