<template>
  <div class="bg-white rounded-lg shadow border-l-4" :class="borderColor">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ severityIcon }}</span>
          <div>
            <h3 class="font-semibold text-gray-900">{{ alert.title }}</h3>
            <p class="text-xs text-gray-600">{{ formatDate(alert.createdAt) }}</p>
          </div>
        </div>
        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="severityBadgeClass">
          {{ severityLabel }}
        </span>
      </div>

      <!-- Message -->
      <div class="mb-3 p-3 rounded" :class="messageBackgroundClass">
        <p class="text-sm text-gray-900">{{ alert.message }}</p>
      </div>

      <!-- Alert Type and Details -->
      <div v-if="alert.type || alert.details" class="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div v-if="alert.type">
          <p class="text-gray-600">Type</p>
          <p class="font-semibold text-gray-900">{{ typeLabel }}</p>
        </div>
        <div v-if="alert.details">
          <p class="text-gray-600">Détails</p>
          <p class="font-semibold text-gray-900">{{ alert.details }}</p>
        </div>
      </div>

      <!-- Affected Entity -->
      <div v-if="affectedEntity" class="mb-3 p-2 rounded bg-gray-50 text-xs">
        <p class="text-gray-600">Concerné</p>
        <p class="font-semibold text-gray-900">{{ affectedEntity }}</p>
      </div>

      <!-- Status -->
      <div class="mb-3 flex items-center gap-2 text-xs">
        <div :class="['w-2 h-2 rounded-full', statusDot]"></div>
        <p class="text-gray-600">
          <span class="font-semibold">{{ alert.status || 'Actif' }}</span>
          <span v-if="alert.resolvedAt" class="text-gray-500">
            • Résolu: {{ formatDate(alert.resolvedAt) }}
          </span>
        </p>
      </div>

      <!-- Priority Actions -->
      <div class="flex gap-2 text-xs">
        <button
          v-if="!alert.acknowledged"
          @click="$emit('acknowledge')"
          class="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-medium transition"
        >
          👀 Reconnaître
        </button>
        <button
          v-if="alert.severity === 'critical' || alert.severity === 'serious'"
          @click="$emit('escalate')"
          class="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded font-medium transition"
        >
          🚨 Escalade
        </button>
        <button
          @click="$emit('dismiss')"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded font-medium transition"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['acknowledge', 'escalate', 'dismiss'])

const formatDate = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const severityLabel = computed(() => {
  const labels = {
    critical: '🔴 CRITIQUE',
    serious: '🟠 GRAVE',
    moderate: '🟡 MODÉRÉ',
    mild: '🟢 LÉGER'
  }
  return labels[props.alert.severity] || props.alert.severity?.toUpperCase()
})

const severityIcon = computed(() => {
  const icons = {
    critical: '🚨',
    serious: '⚠️',
    moderate: '⚡',
    mild: 'ℹ️'
  }
  return icons[props.alert.severity] || '📢'
})

const borderColor = computed(() => {
  const colors = {
    critical: 'border-red-500',
    serious: 'border-orange-500',
    moderate: 'border-yellow-500',
    mild: 'border-green-500'
  }
  return colors[props.alert.severity] || 'border-gray-300'
})

const severityBadgeClass = computed(() => {
  const classes = {
    critical: 'bg-red-100 text-red-900',
    serious: 'bg-orange-100 text-orange-900',
    moderate: 'bg-yellow-100 text-yellow-900',
    mild: 'bg-green-100 text-green-900'
  }
  return classes[props.alert.severity] || 'bg-gray-100 text-gray-900'
})

const messageBackgroundClass = computed(() => {
  const classes = {
    critical: 'bg-red-50',
    serious: 'bg-orange-50',
    moderate: 'bg-yellow-50',
    mild: 'bg-green-50'
  }
  return classes[props.alert.severity] || 'bg-gray-50'
})

const statusDot = computed(() => {
  const status = props.alert.status?.toLowerCase()
  const dotClasses = {
    active: 'bg-red-500',
    'in-progress': 'bg-blue-500',
    acknowledged: 'bg-yellow-500',
    resolved: 'bg-green-500'
  }
  return dotClasses[status] || 'bg-gray-400'
})

const typeLabel = computed(() => {
  const type = props.alert.type
  const labels = {
    health_incident: 'Incident sanitaire',
    disease_outbreak: 'Foyer de maladie',
    medication_alert: 'Alerte médicament',
    vaccination_due: 'Vaccination prévue',
    mortality: 'Mortalité élevée',
    treatment_failure: 'Échec de traitement',
    product_expiry: 'Expiration produit'
  }
  return labels[type] || type
})

const affectedEntity = computed(() => {
  if (props.alert.campaign?.name) return `Campagne: ${props.alert.campaign.name}`
  if (props.alert.animal?.earTag) return `Animal: ${props.alert.animal.earTag}`
  if (props.alert.product?.name) return `Produit: ${props.alert.product.name}`
  return null
})
</script>
