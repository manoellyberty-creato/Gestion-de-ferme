<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReport } from '../stores/useReport'
import TransactionCard from '../components/reports/TransactionCard.vue'
import FinancialSummaryCard from '../components/reports/FinancialSummaryCard.vue'
import TransactionForm from '../components/reports/TransactionForm.vue'
import TransactionFilters from '../components/reports/TransactionFilters.vue'
import TransactionTable from '../components/reports/TransactionTable.vue'

const reportStore = useReport()
const activeTab = ref('transactions')
const showTransactionForm = ref(false)
const editingTransaction = ref(null)
const currentFilters = ref({})
const cashFlowPeriod = ref('monthly')

const financialDetails = computed(() => {
  if (!reportStore.financialSummary?.details) return []
  const details = []
  reportStore.financialSummary.details.forEach(group => {
    group.categories.forEach(cat => {
      details.push({
        type: group._id,
        category: cat.category,
        total: cat.total,
        count: cat.count
      })
    })
  })
  return details
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value)
}

const loadTransactions = async (page = 1) => {
  await reportStore.fetchTransactions(currentFilters.value, page)
}

const applyFilters = async (filters) => {
  currentFilters.value = filters
  await loadTransactions(1)
}

const handleEditTransaction = (transaction) => {
  editingTransaction.value = transaction
  showTransactionForm.value = true
}

const handleDeleteTransaction = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
    try {
      await reportStore.deleteTransaction(id)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }
}

const handleTransactionFormSuccess = async (data) => {
  try {
    if (editingTransaction.value?._id) {
      await reportStore.updateTransaction(editingTransaction.value._id, data)
    } else {
      await reportStore.createTransaction(data)
    }
    closeTransactionForm()
  } catch (err) {
    console.error('Erreur:', err)
  }
}

const closeTransactionForm = () => {
  showTransactionForm.value = false
  editingTransaction.value = null
}

const loadCashFlow = async () => {
  try {
    await reportStore.fetchCashFlow(null, cashFlowPeriod.value)
  } catch (err) {
    console.error('Erreur:', err)
  }
}

onMounted(() => {
  loadTransactions()
  reportStore.fetchFinancialSummary()
  loadCashFlow()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Rapports Financiers</h1>
      <p class="text-gray-600 mt-1">Gestion des transactions et analyses financières</p>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-md border-b">
      <div class="flex">
        <button
          @click="activeTab = 'transactions'"
          :class="[
            'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
            activeTab === 'transactions'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          Transactions ({{ reportStore.transactionCount }})
        </button>
        <button
          @click="activeTab = 'summary'"
          :class="[
            'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
            activeTab === 'summary'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          Résumé Financier
        </button>
        <button
          @click="activeTab = 'cashflow'"
          :class="[
            'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
            activeTab === 'cashflow'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          Flux de Trésorerie
        </button>
      </div>
    </div>

    <!-- TAB 1: TRANSACTIONS -->
    <div v-show="activeTab === 'transactions'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Transactions</h2>
        <button
          @click="showTransactionForm = true"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          + Ajouter une transaction
        </button>
      </div>

      <!-- Filters -->
      <TransactionFilters
        :filters="currentFilters"
        @update="applyFilters"
      />

      <!-- Loading -->
      <div v-if="reportStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Chargement des transactions...</p>
      </div>

      <!-- Table View -->
      <div v-else>
        <TransactionTable
          :transactions="reportStore.transactions"
          @edit="handleEditTransaction"
          @delete="handleDeleteTransaction"
        />

        <!-- Pagination -->
        <div v-if="reportStore.pagination.pages > 1" class="mt-6 flex justify-center gap-2">
          <button
            v-for="page in reportStore.pagination.pages"
            :key="page"
            @click="loadTransactions(page)"
            :class="[
              'px-3 py-1 rounded border',
              reportStore.pagination.page === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <!-- Modal formulaire transaction -->
      <transition name="modal">
        <div v-if="showTransactionForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 class="text-xl font-bold">{{ editingTransaction ? 'Éditer la transaction' : 'Ajouter une transaction' }}</h2>
              <button @click="closeTransactionForm" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div class="p-6">
              <TransactionForm
                :transaction="editingTransaction"
                :loading="reportStore.loading"
                @cancel="closeTransactionForm"
                @success="handleTransactionFormSuccess"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- TAB 2: RÉSUMÉ FINANCIER -->
    <div v-show="activeTab === 'summary'" class="space-y-6">
      <h2 class="text-2xl font-bold">Résumé Financier</h2>

      <!-- Loading -->
      <div v-if="reportStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Chargement du résumé...</p>
      </div>

      <!-- Summary Cards -->
      <div v-else>
        <FinancialSummaryCard
          :total-income="reportStore.totalIncome"
          :total-expense="reportStore.totalExpense"
          :net-profit="reportStore.netProfit"
          :profit-margin="reportStore.profitMargin"
        />

        <!-- Details by Category -->
        <div class="mt-6 bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-bold mb-4">Détails par Catégorie</h3>
          <div v-if="financialDetails.length === 0" class="text-center py-8 text-gray-500">
            Aucune donnée disponible
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-medium">Type</th>
                  <th class="px-4 py-2 text-left text-sm font-medium">Catégorie</th>
                  <th class="px-4 py-2 text-right text-sm font-medium">Total</th>
                  <th class="px-4 py-2 text-right text-sm font-medium">Nombre</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="(item, idx) in financialDetails" :key="idx" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-sm">
                    <span
                      :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        item.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ item.type === 'income' ? 'Revenu' : 'Dépense' }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-sm font-medium">{{ item.category }}</td>
                  <td :class="['px-4 py-2 text-sm font-semibold text-right', item.type === 'income' ? 'text-green-600' : 'text-red-600']">
                    {{ formatCurrency(item.total) }}
                  </td>
                  <td class="px-4 py-2 text-sm text-right">{{ item.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: FLUX DE TRÉSORERIE -->
    <div v-show="activeTab === 'cashflow'" class="space-y-6">
      <h2 class="text-2xl font-bold">Flux de Trésorerie</h2>

      <!-- Period Selector -->
      <div class="bg-white rounded-lg shadow p-4">
        <select
          v-model="cashFlowPeriod"
          @change="loadCashFlow"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="reportStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Chargement du flux de trésorerie...</p>
      </div>

      <!-- Cash Flow Chart -->
      <div v-else class="bg-white rounded-lg shadow p-6">
        <div v-if="!(reportStore.cashFlowData && reportStore.cashFlowData.length > 0)" class="text-center py-12 text-gray-500">
          Aucune donnée de flux de trésorerie
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium">Période</th>
                <th class="px-4 py-2 text-right text-sm font-medium text-green-600">Revenus</th>
                <th class="px-4 py-2 text-right text-sm font-medium text-red-600">Dépenses</th>
                <th class="px-4 py-2 text-right text-sm font-medium">Net</th>
                <th class="px-4 py-2 text-right text-sm font-medium">Transactions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="(item, idx) in reportStore.cashFlowData || []" :key="idx" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm font-medium">{{ item.period }}</td>
                <td class="px-4 py-2 text-sm text-right text-green-600 font-semibold">{{ formatCurrency(item.income) }}</td>
                <td class="px-4 py-2 text-sm text-right text-red-600 font-semibold">{{ formatCurrency(item.expense) }}</td>
                <td class="px-4 py-2 text-sm text-right font-semibold" :class="(item.income - item.expense) >= 0 ? 'text-blue-600' : 'text-red-600'">
                  {{ formatCurrency(item.income - item.expense) }}
                </td>
                <td class="px-4 py-2 text-sm text-right">{{ item.transactions }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
