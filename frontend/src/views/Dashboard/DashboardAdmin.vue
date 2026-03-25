<script setup>
import { onMounted, computed } from 'vue'
import { useDashboard } from '../../stores/useDashboard'
import KpiCard from '../../components/dashboard/KpiCard.vue'
import CashFlowTable from '../../components/dashboard/CashFlowTable.vue'

const dashboardStore = useDashboard()

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value)
}

const lowStockCount = computed(() => dashboardStore.feedStats.lowStockCount ?? 0)
const expiringSoonCount = computed(() => {
  const alerts = dashboardStore.dashboard.alerts || []
  return alerts.filter(a => String(a).toLowerCase().includes('expir')).length
})
const criticalAlertCount = computed(() => dashboardStore.dashboard.alerts?.length ?? 0)

const topExpenseCategories = computed(() => {
  const categories = dashboardStore.dashboard.expenseAnalysis?.categories || []
  return categories.sort((a, b) => b.total - a.total).slice(0, 5)
})

onMounted(() => {
  dashboardStore.fetchAll()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
      <p class="text-gray-600 mt-1">Vue d'ensemble des performances et alertes</p>
    </div>

    <div v-if="dashboardStore.loading" class="py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-blue-500"></div>
      <p class="mt-3 text-gray-600">Chargement des données...</p>
    </div>


    <div v-if="!dashboardStore.loading && !dashboardStore.error" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Revenu total"
          :value="dashboardStore.kpis.totalRevenue"
          currency="XOF"
          variant="green"
          subtitle="Données depuis le début"
        />
        <KpiCard
          title="Dépenses totales"
          :value="dashboardStore.kpis.totalExpenses"
          currency="XOF"
          variant="red"
          subtitle="Données depuis le début"
        />
        <KpiCard
          title="Profit net"
          :value="dashboardStore.kpis.netProfit"
          currency="XOF"
          :variant="dashboardStore.profitStatus === 'positive' ? 'blue' : (dashboardStore.profitStatus === 'negative' ? 'red' : 'yellow')"
          subtitle="Revenu - Dépense"
        />
        <KpiCard
          title="Marge"
          :value="dashboardStore.kpis.profitMargin !== null ? `${dashboardStore.kpis.profitMargin.toFixed(2)}%` : '-'"
          variant="purple"
          subtitle="Rentabilité"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg shadow">
          <p class="text-xs text-orange-600 uppercase font-semibold">Stock critique</p>
          <p class="mt-2 text-2xl font-bold">{{ lowStockCount }}</p>
          <p class="text-sm text-gray-500">produits en rupture ou seuil critique</p>
        </div>
        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow">
          <p class="text-xs text-red-600 uppercase font-semibold">Expiration proche</p>
          <p class="mt-2 text-2xl font-bold">{{ expiringSoonCount }}</p>
          <p class="text-sm text-gray-500">produits expirant dans 30 jours</p>
        </div>
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow">
          <p class="text-xs text-blue-600 uppercase font-semibold">Alertes actives</p>
          <p class="mt-2 text-2xl font-bold">{{ criticalAlertCount }}</p>
          <p class="text-sm text-gray-500">alertes prioritaires</p>
        </div>
        <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow">
          <p class="text-xs text-green-600 uppercase font-semibold">Prescriptions actives</p>
          <p class="mt-2 text-2xl font-bold">{{ dashboardStore.healthStats.activePrescriptions ?? 0 }}</p>
          <p class="text-sm text-gray-500">traitements en cours</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg shadow p-4 space-y-4">
          <h2 class="text-xl font-bold">Statistiques produits alimentaires</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Total produits</p>
              <p class="text-xl font-semibold">{{ dashboardStore.feedStats.totalProducts ?? 0 }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Valeur stock</p>
              <p class="text-xl font-semibold">{{ formatCurrency(dashboardStore.feedStats.totalValue ?? 0) }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Stock bas</p>
              <p class="text-xl font-semibold">{{ dashboardStore.feedStats.lowStockCount ?? 0 }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Type de produits</p>
              <p class="text-xl font-semibold">{{ dashboardStore.feedStats.byType?.length ?? 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 space-y-4">
          <h2 class="text-xl font-bold">Statistiques Santé</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Prescriptions totales</p>
              <p class="text-xl font-semibold">{{ dashboardStore.healthStats.totalPrescriptions ?? 0 }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Actives</p>
              <p class="text-xl font-semibold">{{ dashboardStore.healthStats.activePrescriptions ?? 0 }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Terminées</p>
              <p class="text-xl font-semibold">{{ dashboardStore.healthStats.completedPrescriptions ?? 0 }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-500">Coût total</p>
              <p class="text-xl font-semibold">{{ formatCurrency(dashboardStore.healthStats.totalCost ?? 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <CashFlowTable :cashFlow="dashboardStore.dashboard.cashFlow || []" />

      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-xl font-bold mb-3">Analyse des dépenses</h2>
        <div v-if="topExpenseCategories.length === 0" class="py-8 text-center text-gray-500">Aucune donnée de dépenses.</div>
        <div v-else class="space-y-2">
          <div v-for="(item, idx) in topExpenseCategories" :key="item.category" class="p-3 border rounded flex justify-between items-center">
            <div>
              <p class="font-semibold">{{ idx + 1 }}. {{ item.category }}</p>
              <p class="text-xs text-gray-500">{{ item.count }} transactions • {{ item.percentage.toFixed(2) }}%</p>
            </div>
            <p class="text-sm font-bold text-gray-700">{{ formatCurrency(item.total) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-xl font-bold mb-3">Alertes</h2>
        <ul class="space-y-2 text-sm">
          <li v-if="dashboardStore.dashboard.alerts?.length === 0" class="text-gray-500">Aucune alerte active.</li>
          <li v-for="(item, idx) in dashboardStore.dashboard.alerts" :key="idx" class="p-2 border rounded bg-red-50 text-red-700">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
