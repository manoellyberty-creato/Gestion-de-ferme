<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVeterinarianDashboard } from '../../stores/useVeterinarianDashboard'
import PrescriptionCard from '../../components/veterinarian/PrescriptionCard.vue'
import SickAnimalCard from '../../components/veterinarian/SickAnimalCard.vue'
import HealthProductCard from '../../components/veterinarian/HealthProductCard.vue'
import HealthAlertCard from '../../components/veterinarian/HealthAlertCard.vue'

const dashboardStore = useVeterinarianDashboard()

// State
const selectedCampaignId = ref('')
const activeTab = ref('prescriptions')
const showPrescriptionForm = ref(false)
const showProductForm = ref(false)
const showExpiredOnly = ref(false)

// Placeholder for available campaigns
const availableCampaigns = ref([])

// Tab definitions
const tabs = [
  { id: 'prescriptions', label: '💊 Prescriptions', count: () => dashboardStore.activePrescriptionsCount },
  { id: 'sick-animals', label: '🐑 Animaux Malades', count: () => dashboardStore.sickAnimalsCount },
  { id: 'products', label: '🧪 Produits', count: () => dashboardStore.healthProducts.length },
  { id: 'alerts', label: '🚨 Alertes', count: () => dashboardStore.totalHealthAlerts }
]

// Computed
const filteredProducts = computed(() => {
  if (!showExpiredOnly.value) return dashboardStore.healthProducts
  return [
    ...dashboardStore.expiredProducts,
    ...dashboardStore.nearExpirationProducts
  ].filter((p, idx, arr) => arr.findIndex(x => x._id === p._id) === idx)
})

const sortedAlerts = computed(() => {
  const severity = { critical: 0, serious: 1, moderate: 2, mild: 3 }
  return [...dashboardStore.healthAlerts].sort(
    (a, b) => (severity[a.severity] ?? 99) - (severity[b.severity] ?? 99)
  )
})

// Methods
const handleCampaignChange = async () => {
  if (selectedCampaignId.value) {
    await dashboardStore.fetchAll(selectedCampaignId.value)
    activeTab.value = 'prescriptions'
  }
}

const getPrescriptionCountForAnimal = (animalId) => {
  return dashboardStore.prescriptions.filter(p => p.animal?._id === animalId).length
}

const handleAdminister = (prescription) => {
  console.log('Administer:', prescription)
  // modal form to add administration
}

const showPrescriptionDetails = (prescription) => {
  console.log('View prescription details:', prescription)
}

const editPrescription = (prescription) => {
  console.log('Edit prescription:', prescription)
}

const showAnimalHistory = (animal) => {
  console.log('Show animal history:', animal)
}

const createPrescriptionForAnimal = (animal) => {
  console.log('Create prescription for:', animal)
  showPrescriptionForm.value = true
}

const handleUseProduct = (product) => {
  console.log('Use product:', product)
}

const handleRestock = (product) => {
  console.log('Restock product:', product)
}

const showProductDetails = (product) => {
  console.log('View product details:', product)
}

const acknowledgeAlert = (alert) => {
  console.log('Acknowledge alert:', alert)
}

const escalateAlert = (alert) => {
  console.log('Escalate alert:', alert)
}

const dismissAlert = (alert) => {
  console.log('Dismiss alert:', alert)
}

// Fetch available campaigns on mount
onMounted(async () => {
  try {
    // TODO: Fetch campaigns from backend using campaignService
    // For now, use mock data or fetch from store
    availableCampaigns.value = []
  } catch (err) {
    console.error('Error fetching campaigns:', err)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        🩺 Dashboard Vétérinaire
      </h1>
      <p class="text-gray-600">Gestion de la santé animale et des prescriptions</p>
    </div>

    <!-- Campaign Selector -->
    <div class="card bg-white rounded-lg shadow-md p-6 mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">Sélectionner une campagne</label>
      <div class="flex gap-4 items-center">
        <select
          v-model="selectedCampaignId"
          @change="handleCampaignChange"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choisir une campagne --</option>
          <option v-for="campaign in availableCampaigns" :key="campaign._id" :value="campaign._id">
            {{ campaign.name }} ({{ campaign.animalCount }} animaux)
          </option>
        </select>
        <button
          v-if="selectedCampaignId"
          @click="handleCampaignChange"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Charger
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.loading" class="text-center py-12">
      <p class="text-gray-600">Chargement des données...</p>
      <div class="mt-4 flex justify-center">
        <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="dashboardStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-900 font-semibold">⚠️ Erreur</p>
      <p class="text-red-700">{{ dashboardStore.error }}</p>
    </div>

    <!-- Alert Banner for Critical Issues -->
    <div v-if="dashboardStore.criticalAlerts.length > 0" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
      <p class="font-semibold text-red-900 mb-2">🚨 {{ dashboardStore.criticalAlerts.length }} Alerte(s) critique(s)</p>
      <ul class="text-sm text-red-800 space-y-1">
        <li v-for="alert in dashboardStore.criticalAlerts.slice(0, 3)" :key="alert._id">
          • {{ alert.title }}: {{ alert.message.substring(0, 50) }}...
        </li>
      </ul>
    </div>

    <!-- KPI Cards -->
    <div v-if="selectedCampaignId && !dashboardStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Active Prescriptions KPI -->
      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
        <div class="text-sm text-gray-600 mb-2">Prescriptions Actives</div>
        <div class="text-4xl font-bold text-blue-600">{{ dashboardStore.activePrescriptionsCount }}</div>
        <p class="text-xs text-gray-500 mt-2">
          {{ dashboardStore.prescriptionsByStatus.completed }} complétées
        </p>
      </div>

      <!-- Sick Animals KPI -->
      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
        <div class="text-sm text-gray-600 mb-2">Animaux Malades</div>
        <div class="text-4xl font-bold text-orange-600">{{ dashboardStore.sickAnimalsCount }}</div>
        <p class="text-xs text-gray-500 mt-2">En suivi médical</p>
      </div>

      <!-- Products Needing Attention KPI -->
      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
        <div class="text-sm text-gray-600 mb-2">Produits à Attention</div>
        <div class="text-4xl font-bold text-yellow-600">{{ dashboardStore.productsNeedingAttention }}</div>
        <p class="text-xs text-gray-500 mt-2">Expirations/Ruptures</p>
      </div>

      <!-- Health Alerts KPI -->
      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
        <div class="text-sm text-gray-600 mb-2">Alertes Santé</div>
        <div class="text-4xl font-bold text-red-600">{{ dashboardStore.totalHealthAlerts }}</div>
        <p class="text-xs text-gray-500 mt-2">{{ dashboardStore.criticalAlerts.length }} critiques</p>
      </div>
    </div>

    <!-- Tabs Section -->
    <div v-if="selectedCampaignId && !dashboardStore.loading" class="space-y-6">
      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow-md border-b border-gray-200">
        <div class="flex border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 px-4 py-3 font-medium text-center transition"
            :class="
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            "
          >
            {{ tab.label }} ({{ tab.count }})
          </button>
        </div>
      </div>

      <!-- Active Prescriptions Tab -->
      <div v-if="activeTab === 'prescriptions'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Prescriptions Actives</h2>
          <button
            @click="showPrescriptionForm = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            ➕ Nouvelle Prescription
          </button>
        </div>

        <div v-if="dashboardStore.prescriptions.length === 0" class="text-center py-12">
          <p class="text-gray-600">Aucune prescription active</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PrescriptionCard
            v-for="prescription in dashboardStore.prescriptions"
            :key="prescription._id"
            :prescription="prescription"
            @administer="handleAdminister(prescription)"
            @view-details="showPrescriptionDetails(prescription)"
            @edit="editPrescription(prescription)"
          />
        </div>
      </div>

      <!-- Sick Animals Tab -->
      <div v-if="activeTab === 'sick-animals'" class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900">Animaux en Traitement</h2>

        <div v-if="dashboardStore.sickAnimals.length === 0" class="text-center py-12">
          <p class="text-gray-600">Aucun animal malade détecté</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SickAnimalCard
            v-for="animal in dashboardStore.sickAnimals"
            :key="animal._id"
            :animal="animal"
            :prescription-count="getPrescriptionCountForAnimal(animal._id)"
            @view-history="showAnimalHistory(animal)"
            @create-prescription="createPrescriptionForAnimal(animal)"
          />
        </div>
      </div>

      <!-- Health Products Tab -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Produits Sanitaires</h2>
          <div class="flex gap-2">
            <button
              v-if="dashboardStore.expiredProducts.length > 0 || dashboardStore.nearExpirationProducts.length > 0"
              @click="showExpiredOnly = !showExpiredOnly"
              class="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-lg font-medium transition"
            >
              {{ showExpiredOnly ? 'Tous' : 'Alertes (⚠️)' }}
            </button>
            <button
              @click="showProductForm = true"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              ➕ Ajouter Produit
            </button>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <p class="text-gray-600">{{ showExpiredOnly ? 'Aucune alerte' : 'Aucun produit' }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <HealthProductCard
            v-for="product in filteredProducts"
            :key="product._id"
            :product="product"
            @use-product="handleUseProduct(product)"
            @restock="handleRestock(product)"
            @view-details="showProductDetails(product)"
          />
        </div>
      </div>

      <!-- Health Alerts Tab -->
      <div v-if="activeTab === 'alerts'" class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900">Alertes Sanitaires</h2>

        <div v-if="dashboardStore.healthAlerts.length === 0" class="text-center py-12">
          <p class="text-gray-600">Aucune alerte sanitaire</p>
        </div>

        <div v-else class="space-y-4">
          <HealthAlertCard
            v-for="alert in sortedAlerts"
            :key="alert._id"
            :alert="alert"
            @acknowledge="acknowledgeAlert(alert)"
            @escalate="escalateAlert(alert)"
            @dismiss="dismissAlert(alert)"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedCampaignId && !dashboardStore.loading" class="text-center py-16">
      <p class="text-gray-600 text-lg">Sélectionnez une campagne pour commencer</p>
    </div>

    <!-- Modals (if needed) -->
    <div v-if="showPrescriptionForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Nouvelle Prescription</h3>
        <p class="text-gray-600 text-sm mb-4">Fonctionnalité en cours de développement</p>
        <button
          @click="showPrescriptionForm = false"
          class="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition"
        >
          Fermer
        </button>
      </div>
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