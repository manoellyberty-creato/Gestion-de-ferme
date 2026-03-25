<script setup>
import { onMounted } from 'vue'
import { useManagerDashboard } from '../../stores/useManagerDashboard'
import OperationalKpiCard from '../../components/dashboard/OperationalKpiCard.vue'

const managerStore = useManagerDashboard()

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value || 0)
}

const handleCampaignChange = async () => {
  await managerStore.selectCampaign(managerStore.selectedCampaign)
}

onMounted(() => {
  managerStore.fetchAll()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Gestionnaire</h1>
      <p class="text-gray-600 mt-1">Supervision opérationnelle des campagnes et animaux</p>
    </div>

    <!-- Sélection campagne -->
    <div class="bg-white rounded-lg shadow p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Sélectionner une campagne</label>
      <select
        v-model="managerStore.selectedCampaign"
        @change="handleCampaignChange"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="campaign in managerStore.campaigns" :key="campaign._id" :value="campaign._id">
          {{ campaign.name }} ({{ campaign.status }})
        </option>
      </select>
    </div>

    <!-- Loading & Error -->
    <div v-if="managerStore.loading" class="py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-blue-500"></div>
      <p class="mt-3 text-gray-600">Chargement des données...</p>
    </div>

    <div v-if="managerStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
      {{ managerStore.error }}
    </div>

    <div v-if="!managerStore.loading && !managerStore.error && managerStore.selectedCampaign" class="space-y-6">
      <!-- KPI Opérationnels -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OperationalKpiCard
          title="Campagnes actives"
          :value="managerStore.activeCampaignsCount"
          suffix=""
          variant="blue"
          icon="📊"
          subtitle="En cours"
        />
        <OperationalKpiCard
          title="Total animaux"
          :value="managerStore.totalAnimalsCount"
          suffix=""
          variant="green"
          icon="🐔"
          subtitle="Campagne sélectionnée"
        />
        <OperationalKpiCard
          title="Santé animale"
          :value="managerStore.healthyAnimalsCount + ' sains'"
          suffix=""
          variant="green"
          icon="✅"
          subtitle="État global"
        />
        <OperationalKpiCard
          title="Mortality rate"
          :value="managerStore.animalMortalityRate"
          suffix="%"
          variant="red"
          icon="⚠️"
          :subtitle="`${managerStore.sickAnimalsCount} malades`"
        />
      </div>

      <!-- Finances campagne -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 class="text-lg font-bold">Performance campagne</h2>
          <div v-if="managerStore.campaignFinancial" class="space-y-2 text-sm">
            <div class="flex justify-between border-b pb-2">
              <span class="text-gray-600">Budget</span>
              <span class="font-semibold">{{ formatCurrency(managerStore.campaignFinancial.budget) }}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
              <span class="text-gray-600">Dépenses réelles</span>
              <span class="font-semibold">{{ formatCurrency(managerStore.campaignFinancial.actual) }}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
              <span class="text-gray-600">Variance</span>
              <span :class="['font-semibold', (managerStore.campaignFinancial.variance || 0) >= 0 ? 'text-green-600' : 'text-red-600']">
                {{ formatCurrency(managerStore.campaignFinancial.variance) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 font-semibold">ROI</span>
              <span :class="['font-bold text-lg', (managerStore.averageCampaignROI || 0) >= 0 ? 'text-green-600' : 'text-red-600']">
                {{ (managerStore.averageCampaignROI || 0).toFixed(2) }}%
              </span>
            </div>
          </div>
          <div v-else class="text-gray-500 text-sm">Données financières indisponibles</div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 class="text-lg font-bold">Statistiques animaux</h2>
          <div v-if="managerStore.animalStats" class="space-y-2 text-sm">
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-green-50 p-2 rounded">
                <p class="text-xs text-gray-500">Sains</p>
                <p class="text-xl font-bold text-green-600">{{ managerStore.healthyAnimalsCount }}</p>
              </div>
              <div class="bg-red-50 p-2 rounded">
                <p class="text-xs text-gray-500">Malades</p>
                <p class="text-xl font-bold text-red-600">{{ managerStore.sickAnimalsCount }}</p>
              </div>
              <div class="bg-orange-50 p-2 rounded">
                <p class="text-xs text-gray-500">Poids moyen</p>
                <p class="text-lg font-bold text-orange-600">
                  {{ managerStore.animalStats.averageWeight ? managerStore.animalStats.averageWeight.toFixed(2) + ' kg' : '-' }}
                </p>
              </div>
              <div class="bg-blue-50 p-2 rounded">
                <p class="text-xs text-gray-500">Mortalité</p>
                <p class="text-lg font-bold text-blue-600">{{ managerStore.animalMortalityRate }}%</p>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-sm">Données animaux indisponibles</div>
        </div>
      </div>

      <!-- Alertes critiques -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-bold mb-3">Alertes critiques</h2>
        <div v-if="managerStore.criticalAlerts.length === 0" class="text-gray-500 text-sm">
          Aucune alerte critique
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="alert in managerStore.criticalAlerts"
            :key="alert._id"
            class="p-3 border-l-4 border-red-500 bg-red-50 text-red-700 text-sm rounded"
          >
            <p class="font-semibold">{{ alert.title }}</p>
            <p class="text-xs mt-1">{{ alert.message }}</p>
          </li>
        </ul>
      </div>

      <!-- Tous les animaux de la campagne -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-bold mb-3">Animaux ({{ managerStore.totalAnimalsCount }})</h2>
        <div v-if="managerStore.animals.length === 0" class="text-gray-500 text-sm">
          Aucun animal dans cette campagne
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead class="bg-gray-100 text-xs uppercase">
              <tr>
                <th class="px-3 py-2 border">ID</th>
                <th class="px-3 py-2 border">Espèce</th>
                <th class="px-3 py-2 border">Poids</th>
                <th class="px-3 py-2 border">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="animal in managerStore.animals.slice(0, 10)" :key="animal._id" class="hover:bg-gray-50">
                <td class="px-3 py-2 border">{{ animal.tagNumber }}</td>
                <td class="px-3 py-2 border">{{ animal.species }}</td>
                <td class="px-3 py-2 border">{{ animal.weight }} kg</td>
                <td class="px-3 py-2 border">
                  <span :class="['px-2 py-1 rounded-full text-xs font-medium', animal.healthStatus === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ animal.healthStatus === 'healthy' ? 'Sain' : 'Malade' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="managerStore.animals.length > 10" class="text-xs text-gray-500 mt-2 text-center">
            ... et {{ managerStore.animals.length - 10 }} autres
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
