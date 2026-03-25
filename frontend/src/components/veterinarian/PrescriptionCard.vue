<template>
  <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border-t-4" :class="statusBorderColor">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="font-semibold text-gray-900">{{ prescription.animal?.earTag || 'Animal' }}</h3>
          <p class="text-xs text-gray-600">Rx ID: {{ prescription._id?.slice(-8) }}</p>
        </div>
        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass">
          {{ statusLabel }}
        </span>
      </div>

      <!-- Prescription Details -->
      <div class="mb-4 pb-4 border-b border-gray-100">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Médicament</span>
            <span class="text-sm font-semibold text-gray-900">{{ prescription.medication?.name || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Dosage</span>
            <span class="text-sm font-semibold text-gray-900">{{ prescription.dosage }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Fréquence</span>
            <span class="text-sm font-semibold text-gray-900">{{ frequencyLabel }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Durée</span>
            <span class="text-sm font-semibold text-gray-900">{{ prescription.duration }} jours</span>
          </div>
        </div>
      </div>

      <!-- Administrations -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-700">Administrations</p>
          <span class="px-2 py-1 bg-blue-50 text-blue-900 rounded text-xs font-semibold">
            {{ administrationCount }}/{{ totalAdministrations }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all"
            :style="{ width: administrationPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Date Info -->
      <div class="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-gray-100 text-xs">
        <div>
          <p class="text-gray-600">Prescrite</p>
          <p class="font-semibold text-gray-900">{{ formatDate(prescription.createdAt) }}</p>
        </div>
        <div>
          <p class="text-gray-600">Fin prévue</p>
          <p class="font-semibold" :class="endDateColor">{{ formatDate(prescription.endDate) }}</p>
        </div>
      </div>

      <!-- Reason -->
      <div class="mb-4 p-2 bg-gray-50 rounded">
        <p class="text-xs text-gray-600 mb-1">Raison</p>
        <p class="text-sm text-gray-900">{{ prescription.reason || 'Non spécifiée' }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          v-if="canAdminister"
          @click="$emit('administer')"
          class="flex-1 px-3 py-2 text-xs bg-green-100 hover:bg-green-200 text-green-900 rounded font-medium transition"
        >
          💊 Administrer
        </button>
        <button
          @click="$emit('view-details')"
          class="flex-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-900 rounded font-medium transition"
        >
          👁️ Détails
        </button>
        <button
          v-if="canEdit"
          @click="$emit('edit')"
          class="px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-medium transition"
        >
          ✏️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prescription: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['administer', 'view-details', 'edit'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const frequencyLabel = computed(() => {
  const freq = props.prescription.frequency
  const labels = {
    once: 'Une fois par jour',
    twice: 'Deux fois par jour',
    thrice: 'Trois fois par jour',
    four: 'Quatre fois par jour',
    custom: props.prescription.customFrequency || 'Personnalisée'
  }
  return labels[freq] || freq
})

const statusLabel = computed(() => {
  const status = props.prescription.status
  const labels = {
    active: '🔵 Actif',
    completed: '✅ Complété',
    pending: '⏳ En attente',
    cancelled: '❌ Annulé'
  }
  return labels[status] || status
})

const statusBadgeClass = computed(() => {
  const status = props.prescription.status
  const classes = {
    active: 'bg-blue-100 text-blue-900',
    completed: 'bg-green-100 text-green-900',
    pending: 'bg-yellow-100 text-yellow-900',
    cancelled: 'bg-red-100 text-red-900'
  }
  return classes[status] || 'bg-gray-100 text-gray-900'
})

const statusBorderColor = computed(() => {
  const status = props.prescription.status
  const colors = {
    active: 'border-blue-500',
    completed: 'border-green-500',
    pending: 'border-yellow-500',
    cancelled: 'border-red-500'
  }
  return colors[status] || 'border-gray-300'
})

const administrationCount = computed(() => {
  return props.prescription.administrations?.length || 0
})

const totalAdministrations = computed(() => {
  const { duration, frequency } = props.prescription
  const freqMap = { once: 1, twice: 2, thrice: 3, four: 4 }
  const timesPerDay = freqMap[frequency] || 1
  return duration * timesPerDay
})

const administrationPercentage = computed(() => {
  const total = totalAdministrations.value
  if (total === 0) return 0
  return Math.round((administrationCount.value / total) * 100)
})

const canAdminister = computed(() => {
  return props.prescription.status === 'active'
})

const canEdit = computed(() => {
  return props.prescription.status === 'active' || props.prescription.status === 'pending'
})

const endDateColor = computed(() => {
  if (!props.prescription.endDate) return 'text-gray-900'
  const endDate = new Date(props.prescription.endDate)
  const now = new Date()
  const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
  
  if (daysLeft < 0) return 'text-red-600 font-bold'
  if (daysLeft <= 2) return 'text-orange-600'
  return 'text-gray-900'
})
</script>
