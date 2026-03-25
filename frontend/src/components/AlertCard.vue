<script setup>
import { computed } from 'vue'

const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['mark-read', 'resolve'])

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const levelLabel = computed(() => {
  switch (props.alert.level) {
    case 'danger': return 'Danger'
    case 'warning': return 'Avertissement'
    case 'info': return 'Information'
    default: return 'Inconnu'
  }
})

const levelClass = computed(() => {
  switch (props.alert.level) {
    case 'danger': return 'text-red-700 bg-red-50 border-red-200'
    case 'warning': return 'text-orange-700 bg-orange-50 border-orange-200'
    case 'info': return 'text-blue-700 bg-blue-50 border-blue-200'
    default: return 'text-gray-700 bg-gray-50 border-gray-200'
  }
})

const typeLabel = computed(() => {
  switch (props.alert.type) {
    case 'mortality': return 'Mortalité'
    case 'weight_loss': return 'Perte de poids'
    case 'disease': return 'Maladie'
    default: return props.alert.type
  }
})

const statusClass = computed(() => {
  return props.alert.status === 'resolved' ? 'opacity-60' : ''
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 border" :class="[levelClass, statusClass]">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 rounded text-xs font-medium" :class="levelClass">
            {{ levelLabel }}
          </span>
          <span class="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {{ typeLabel }}
          </span>
          <span v-if="alert.status === 'resolved'" class="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
            Résolue
          </span>
          <span v-if="!alert.read" class="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
            Non lue
          </span>
        </div>
        <h3 class="font-semibold text-gray-900 mb-1">{{ alert.message }}</h3>
        <p class="text-xs text-gray-500">
          Créée le {{ formatDate(alert.createdAt) }}
          <span v-if="alert.resolvedAt"> • Résolue le {{ formatDate(alert.resolvedAt) }}</span>
        </p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="!alert.read"
          @click="$emit('mark-read', alert._id)"
          class="px-3 py-1 rounded text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 transition"
        >
          Marquer lu
        </button>
        <button
          v-if="alert.status === 'active'"
          @click="$emit('resolve', alert._id)"
          class="px-3 py-1 rounded text-xs font-medium text-white bg-green-500 hover:bg-green-600 transition"
        >
          Résoudre
        </button>
      </div>
    </div>
  </div>
</template>