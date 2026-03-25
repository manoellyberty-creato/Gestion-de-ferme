<template>
  <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4" :class="severityBorder">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <span class="text-lg">🐑</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">{{ animal.earTag || animal._id }}</h3>
            <p class="text-xs text-gray-600">{{ animal.breed }} • Âge: {{ calculateAge(animal.dateOfBirth) }} mois</p>
          </div>
        </div>
        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass">
          {{ statusLabel }}
        </span>
      </div>

      <!-- Health Stats -->
      <div class="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p class="text-xs text-gray-600">Poids</p>
          <p class="text-sm font-semibold text-gray-900">{{ animal.weight || '—' }} kg</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Température</p>
          <p class="text-sm font-semibold" :class="temperatureColor">
            {{ animal.temperature || '—' }}°C
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Durée</p>
          <p class="text-sm font-semibold text-gray-900">{{ illnessDuration }} j</p>
        </div>
      </div>

      <!-- Current Issue -->
      <div class="mb-4">
        <p class="text-xs text-gray-600 mb-1">Problème actuel</p>
        <p class="text-sm text-gray-900 font-medium">{{ animal.currentHealth?.issue || 'Non spécifié' }}</p>
        <p v-if="animal.currentHealth?.notes" class="text-xs text-gray-600 mt-1 italic">
          {{ animal.currentHealth.notes }}
        </p>
      </div>

      <!-- Prescriptions Count -->
      <div class="mb-4 p-2 bg-blue-50 rounded">
        <p class="text-xs text-blue-900">
          <strong>{{ prescriptionCount }}</strong> prescription(s) active(s)
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('view-history')"
          class="flex-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-900 rounded font-medium transition"
        >
          📋 Historique
        </button>
        <button
          @click="$emit('create-prescription')"
          class="flex-1 px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-medium transition"
        >
          ➕ Prescrire
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  animal: {
    type: Object,
    required: true
  },
  prescriptionCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['view-history', 'create-prescription'])

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return '—'
  const birth = new Date(dateOfBirth)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  return months
}

const illnessDuration = computed(() => {
  if (!props.animal.currentHealth?.dateDetected) return '—'
  const detected = new Date(props.animal.currentHealth.dateDetected)
  const now = new Date()
  const days = Math.floor((now - detected) / (1000 * 60 * 60 * 24))
  return days
})

const statusLabel = computed(() => {
  const status = props.animal.currentHealth?.status
  const labels = {
    critical: '🔴 Critique',
    serious: '🟠 Grave',
    moderate: '🟡 Modéré',
    mild: '🟢 Léger'
  }
  return labels[status] || 'Inconnu'
})

const statusBadgeClass = computed(() => {
  const status = props.animal.currentHealth?.status
  const classes = {
    critical: 'bg-red-100 text-red-900',
    serious: 'bg-orange-100 text-orange-900',
    moderate: 'bg-yellow-100 text-yellow-900',
    mild: 'bg-green-100 text-green-900'
  }
  return classes[status] || 'bg-gray-100 text-gray-900'
})

const severityBorder = computed(() => {
  const status = props.animal.currentHealth?.status
  const borders = {
    critical: 'border-red-500',
    serious: 'border-orange-500',
    moderate: 'border-yellow-500',
    mild: 'border-green-500'
  }
  return borders[status] || 'border-gray-300'
})

const temperatureColor = computed(() => {
  const temp = props.animal.temperature
  if (!temp) return 'text-gray-900'
  if (temp > 39.5) return 'text-red-600 font-bold'
  if (temp > 39) return 'text-orange-600'
  if (temp < 38) return 'text-blue-600'
  return 'text-gray-900'
})
</script>
