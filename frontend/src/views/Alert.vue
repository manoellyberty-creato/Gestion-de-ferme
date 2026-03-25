<script setup>
import { ref, onMounted } from 'vue'
import { useAlertStore } from '@/stores/useAlertStore'
import AlertCard from '@/components/AlertCard.vue'

const alertStore = useAlertStore()

// États locaux
const showCreateForm = ref(false)
const showGenerateForm = ref(false)
const newAlert = ref({
  campaignId: '',
  type: 'mortality',
  level: 'warning',
  message: ''
})
const generateData = ref({
  campaignId: ''
})

// Chargement initial
onMounted(() => {
  alertStore.fetchAlerts()
})

// Gestionnaires d'événements
const handleMarkAsRead = async (alertId) => {
  try {
    await alertStore.markAlertAsRead(alertId)
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const handleResolve = async (alertId) => {
  try {
    await alertStore.resolveAlertAction(alertId)
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const handleCreateAlert = async () => {
  if (!newAlert.value.campaignId || !newAlert.value.message) return

  try {
    await alertStore.createNewAlert(newAlert.value)
    newAlert.value = { campaignId: '', type: 'mortality', level: 'warning', message: '' }
    showCreateForm.value = false
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const handleGenerateAlerts = async () => {
  if (!generateData.value.campaignId) return

  try {
    await alertStore.generateAlerts(generateData.value.campaignId)
    generateData.value = { campaignId: '' }
    showGenerateForm.value = false
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const refreshAlerts = () => {
  alertStore.fetchAlerts()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des Alertes</h1>
        <p class="text-gray-600">Surveillez et gérez toutes les alertes du système</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ alertStore.stats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Actives</p>
              <p class="text-2xl font-bold text-gray-900">{{ alertStore.stats.active }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Résolues</p>
              <p class="text-2xl font-bold text-gray-900">{{ alertStore.stats.resolved }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683l-3-3m3 3l3-3m-3 3V9"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Non lues</p>
              <p class="text-2xl font-bold text-gray-900">{{ alertStore.stats.unread }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-wrap gap-4">
          <button
            @click="showCreateForm = !showCreateForm"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Créer une alerte
          </button>
          <button
            @click="showGenerateForm = !showGenerateForm"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Générer des alertes
          </button>
          <button
            @click="refreshAlerts"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            :disabled="alertStore.loading"
          >
            <svg v-if="alertStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Actualiser
          </button>
        </div>

        <!-- Formulaire de création -->
        <div v-if="showCreateForm" class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Créer une nouvelle alerte</h3>
          <form @submit.prevent="handleCreateAlert" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Campagne</label>
              <input
                v-model="newAlert.campaignId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ID de la campagne"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                v-model="newAlert.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mortality">Mortalité</option>
                <option value="weight_loss">Perte de poids</option>
                <option value="disease">Maladie</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                v-model="newAlert.level"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="info">Information</option>
                <option value="warning">Avertissement</option>
                <option value="danger">Danger</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                v-model="newAlert.message"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description de l'alerte"
                required
              ></textarea>
            </div>
            <div class="md:col-span-2 flex gap-2">
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Créer
              </button>
              <button
                type="button"
                @click="showCreateForm = false"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        <!-- Formulaire de génération -->
        <div v-if="showGenerateForm" class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Générer des alertes automatiques</h3>
          <form @submit.prevent="handleGenerateAlerts" class="max-w-md">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Campagne</label>
              <input
                v-model="generateData.campaignId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ID de la campagne"
                required
              />
            </div>
            <div class="flex gap-2">
              <button
                type="submit"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Générer
              </button>
              <button
                type="button"
                @click="showGenerateForm = false"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Filtres</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              v-model="alertStore.filters.status"
              @change="alertStore.setFilter('status', $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="active">Actives</option>
              <option value="resolved">Résolues</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <select
              v-model="alertStore.filters.level"
              @change="alertStore.setFilter('level', $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="info">Information</option>
              <option value="warning">Avertissement</option>
              <option value="danger">Danger</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              v-model="alertStore.filters.type"
              @change="alertStore.setFilter('type', $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="mortality">Mortalité</option>
              <option value="weight_loss">Perte de poids</option>
              <option value="disease">Maladie</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lecture</label>
            <select
              v-model="alertStore.filters.read"
              @change="alertStore.setFilter('read', $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="read">Lus</option>
              <option value="unread">Non lus</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="alertStore.clearFilters"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Effacer les filtres
          </button>
        </div>
      </div>

      <!-- Liste des alertes -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Alertes ({{ alertStore.filteredAlerts.length }})</h3>
        </div>

        <div v-if="alertStore.loading" class="p-6 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Chargement des alertes...</p>
        </div>

        <div v-else-if="alertStore.error" class="p-6 text-center text-red-600">
          <p>{{ alertStore.error }}</p>
        </div>

        <div v-else-if="alertStore.filteredAlerts.length === 0" class="p-6 text-center text-gray-500">
          <p>Aucune alerte trouvée</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="alert in alertStore.filteredAlerts"
            :key="alert._id"
            class="p-6"
          >
            <AlertCard
              :alert="alert"
              @mark-read="handleMarkAsRead"
              @resolve="handleResolve"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
