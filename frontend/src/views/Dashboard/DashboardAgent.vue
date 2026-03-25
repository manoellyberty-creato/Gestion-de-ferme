<script setup>
import { ref, onMounted } from 'vue'
import { useAgentDashboard } from '../../stores/useAgentDashboard'
import AgentTaskCard from '../../components/agent/AgentTaskCard.vue'
import AgentAlertCard from '../../components/agent/AgentAlertCard.vue'

const agentStore = useAgentDashboard()
const selectedCampaignId = ref('')

const formatWeight = (value) => {
  if (!value && value !== 0) return '-'
  return Number(value).toFixed(2)
}

const handleCampaignChange = async () => {
  await agentStore.selectCampaign(selectedCampaignId.value)
}

onMounted(async () => {
  await agentStore.fetchAll()
  if (agentStore.selectedCampaign) {
    selectedCampaignId.value = agentStore.selectedCampaign._id
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Agent Terrain</h1>
      <p class="text-gray-600 mt-1">Planification des tâches, suivi des actions et gestion des alertes.</p>
    </div>

    <!-- Sélecteur de campagne -->
    <div class="bg-white rounded-lg shadow p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Choisir une campagne</label>
      <select
        v-model="selectedCampaignId"
        @change="handleCampaignChange"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Toutes les campagnes --</option>
        <option v-for="campaign in agentStore.campaigns" :key="campaign._id" :value="campaign._id">
          {{ campaign.name }} ({{ campaign.status }})
        </option>
      </select>
    </div>

    <!-- Loading & Erreur -->
    <div v-if="agentStore.loading" class="py-20 text-center">
      <span class="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-blue-500"></span>
      <p class="mt-3 text-gray-600">Chargement des données...</p>
    </div>

    <div v-if="agentStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
      {{ agentStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-xs text-gray-500">Tâches totales</p>
        <p class="text-3xl font-bold text-blue-600">{{ agentStore.totalTasks }}</p>
        <p class="text-xs text-gray-500">Terminées : {{ agentStore.completedTasks }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-xs text-gray-500">Tâches en cours</p>
        <p class="text-3xl font-bold text-indigo-600">{{ agentStore.inProgressTasks }}</p>
        <p class="text-xs text-gray-500">Taux d'achèvement : {{ agentStore.taskCompletionRate }}%</p>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-xs text-gray-500">Animaux malades</p>
        <p class="text-3xl font-bold text-orange-600">{{ agentStore.sickAnimalsCount }}</p>
        <p class="text-xs text-gray-500">Total animaux : {{ agentStore.totalAnimalsCount }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-xs text-gray-500">Alerte(s)</p>
        <p class="text-3xl font-bold text-red-600">{{ agentStore.alertsCount }}</p>
        <p class="text-xs text-gray-500">Critiques : {{ agentStore.urgentAlerts.length }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Tâches -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Tâches à faire</h2>
          <span class="text-sm text-gray-500">{{ agentStore.taskCompletionRate }}% complété</span>
        </div>

        <div v-if="agentStore.tasks.length === 0" class="text-gray-500">Aucune tâche disponible</div>

        <div v-else class="space-y-3">
          <AgentTaskCard
            v-for="task in agentStore.tasks"
            :key="task._id"
            :task="task"
            @toggle-status="agentStore.toggleTaskStatus"
          />
        </div>
      </div>

      <!-- Alertes -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Alertes terrain</h2>
          <span class="text-sm text-gray-500">{{ agentStore.alertsCount }} alertes</span>
        </div>

        <div v-if="agentStore.alerts.length === 0" class="text-gray-500">Aucune alerte</div>

        <div v-else class="space-y-3">
          <AgentAlertCard
            v-for="alert in agentStore.alerts"
            :key="alert._id"
            :alert="alert"
            @mark-read="agentStore.markAlertRead"
          />
        </div>
      </div>
    </div>

    <!-- Objectifs campagne -->
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-xl font-bold text-gray-900 mb-3">Objectif de campagne</h2>
      <div v-if="agentStore.selectedCampaign">
        <p class="text-sm text-gray-600">Campagne : {{ agentStore.selectedCampaign.name }}</p>
        <p class="text-sm text-gray-600">Objectif poids moyen : {{ formatWeight(agentStore.campaignGoal) }} kg</p>
        <p class="text-sm text-gray-600">Poids moyen actuel : {{ formatWeight(agentStore.currentAverageWeight) }} kg</p>
        <div class="mt-3 h-2 bg-gray-200 rounded-full">
          <div
            class="h-2 rounded-full bg-green-500"
            :style="{ width: agentStore.campaignProgress + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Progrès : {{ agentStore.campaignProgress }}%</p>
      </div>
      <div v-else class="text-gray-500">Sélectionnez une campagne pour voir les objectifs.</div>
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
