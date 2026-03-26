<template>
  <div class="space-y-4">
    <!-- En-tête avec bouton Ajouter -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Prescriptions</h2>
      <button
        @click="$emit('add')"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
      >
        + Nouvelle prescription
      </button>
    </div>

    <!-- Filtres -->
    <div class="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Animal</label>
        <select
          v-model="filters.animal"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les animaux</option>
          <option v-for="animal in animals" :key="animal._id" :value="animal._id">
            {{ animal.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Campagne</label>
        <select
          v-model="filters.campaign"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Toutes les campagnes</option>
          <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
            {{ campaign.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
        <select
          v-model="filters.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="completed">Complété</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
        <button
          @click="applyFilters"
          class="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          Appliquer filtres
        </button>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Chargement des prescriptions...</p>
    </div>

    <!-- Liste vide -->
    <div v-else-if="!filteredPrescriptions.length" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
      <p class="text-yellow-700">Aucune prescription trouvée. <button @click="$emit('add')" class="font-bold underline">Créer une nouvelle prescription</button></p>
    </div>

    <!-- Liste des prescriptions -->
    <div v-else class="grid gap-4">
      <div
        v-for="prescription in filteredPrescriptions"
        :key="prescription._id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <!-- En-tête de la prescription -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">
              {{ prescription.animal?.name }} - {{ prescription.campaign?.name }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              Animal: {{ prescription.animal?.tagNumber }} • Vétérinaire: {{ prescription.veterinarian?.name }}
            </p>
          </div>
          <div class="flex gap-2">
            <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusClass(prescription.status)]">
              {{ getStatusLabel(prescription.status) }}
            </span>
          </div>
        </div>

        <!-- Diagnostic et symptômes -->
        <div class="mb-4 pb-4 border-b">
          <p class="text-sm font-medium text-gray-700 mb-1">Diagnostic:</p>
          <p class="text-gray-700">{{ prescription.diagnosis }}</p>
          <div v-if="prescription.symptoms?.length" class="mt-2">
            <p class="text-sm font-medium text-gray-700 mb-1">Symptômes:</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="symptom in prescription.symptoms" :key="symptom" class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {{ symptom }}
              </span>
            </div>
          </div>
        </div>

        <!-- Produits prescrits -->
        <div class="mb-4 pb-4 border-b">
          <p class="text-sm font-medium text-gray-700 mb-2">Produits prescrits:</p>
          <div class="space-y-2">
            <div v-for="(product, idx) in prescription.prescribedProducts" :key="idx" class="text-sm bg-gray-50 p-2 rounded">
              <p class="font-medium text-gray-900">{{ product.product?.name }}</p>
              <p class="text-gray-600">
                Quan: {{ product.quantity }} | Dosage: {{ product.dosage.amount }} {{ product.dosage.unit }} | 
                {{ product.dosage.frequency }} pendant {{ product.dosage.duration }} j
              </p>
            </div>
          </div>
        </div>

        <!-- Dates et coût -->
        <div class="grid grid-cols-4 gap-4 mb-4 pb-4 border-b">
          <div>
            <p class="text-xs text-gray-600 font-medium">Date de début</p>
            <p class="text-sm text-gray-900 font-medium">{{ formatDate(prescription.startDate) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600 font-medium">Date de fin</p>
            <p class="text-sm text-gray-900 font-medium">{{ formatDate(prescription.endDate) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600 font-medium">Coût total</p>
            <p class="text-sm text-gray-900 font-medium">{{ formatCurrency(prescription.totalCost) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600 font-medium">Créée le</p>
            <p class="text-sm text-gray-900 font-medium">{{ formatDate(prescription.createdAt) }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="$emit('edit', prescription)"
            class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            ✏️ Modifier
          </button>
          <button
            v-if="prescription.status === 'active'"
            @click="updateStatus(prescription._id, 'completed')"
            class="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors font-medium text-sm"
          >
            ✓ Compléter
          </button>
          <button
            v-if="prescription.status === 'active'"
            @click="updateStatus(prescription._id, 'cancelled')"
            class="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium text-sm"
          >
            ✕ Annuler
          </button>
          <button
            @click="$emit('delete', prescription)"
            class="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            🗑️ Supprimer
          </button>
        </div>

        <!-- Notes -->
        <div v-if="prescription.notes" class="mt-4 pt-4 border-t">
          <p class="text-xs text-gray-600 font-medium">Notes:</p>
          <p class="text-sm text-gray-700 italic">{{ prescription.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHealth } from '../../stores/useHealth'

defineProps({
  prescriptions: {
    type: Array,
    default: () => []
  },
  animals: {
    type: Array,
    default: () => []
  },
  campaigns: {
    type: Array,
    default: () => []
  },
  isLoading: Boolean
})

const emit = defineEmits(['add', 'edit', 'delete', 'update-status', 'filter'])

const healthStore = useHealth()

const filters = ref({
  animal: '',
  campaign: '',
  status: ''
})

const filteredPrescriptions = computed(() => {
  let result = [...healthStore.prescriptions]

  if (filters.value.animal) {
    result = result.filter(p => p.animal?._id === filters.value.animal)
  }
  if (filters.value.campaign) {
    result = result.filter(p => p.campaign?._id === filters.value.campaign)
  }
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }

  return result
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (value) => {
  if (!value) return '0 XOF'
  return `${Number(value).toLocaleString('fr-FR')} XOF`
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Actif',
    completed: 'Complété',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const applyFilters = () => {
  emit('filter', filters.value)
}

const updateStatus = async (prescriptionId, newStatus) => {
  try {
    await healthStore.updatePrescriptionStatus(prescriptionId, newStatus)
    emit('update-status', { id: prescriptionId, status: newStatus })
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err)
  }
}

onMounted(async () => {
  await healthStore.fetchPrescriptions()
})
</script>
