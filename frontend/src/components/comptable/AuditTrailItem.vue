<template>
  <div class="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
    <!-- Timeline Dot -->
    <div class="flex flex-col items-center gap-2">
      <div
        class="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
        :class="severityDotClass"
      >
        {{ severityIcon }}
      </div>
      <div v-if="!isLast" class="w-0.5 h-12 bg-gray-200"></div>
    </div>

    <!-- Content -->
    <div class="flex-1 pt-1">
      <!-- Header -->
      <div class="flex items-start justify-between mb-2">
        <div>
          <h4 class="font-semibold text-gray-900">{{ item.action }}</h4>
          <p class="text-xs text-gray-600">{{ formatDate(item.createdAt) }}</p>
        </div>
        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="severityBadge">
          {{ severityLabel }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-700 mb-2">{{ item.description }}</p>

      <!-- User Info -->
      <div class="flex items-center gap-4 p-2 bg-gray-50 rounded mb-2 text-xs">
        <span>
          <strong>Utilisateur:</strong>
          <span class="text-gray-600">{{ item.user?.fullName || 'Système' }}</span>
        </span>
        <span>
          <strong>Rôle:</strong>
          <span class="text-gray-600">{{ roleLabel(item.user?.role) }}</span>
        </span>
      </div>

      <!-- Details -->
      <div v-if="item.details" class="mb-2 p-2 bg-blue-50 rounded text-xs text-blue-900">
        <p><strong>Détails:</strong></p>
        <p class="mt-1">{{ item.details }}</p>
      </div>

      <!-- Changes (if available) -->
      <div v-if="item.changes && item.changes.length > 0">
        <p class="text-xs font-semibold text-gray-700 mb-1">Modifications:</p>
        <div class="space-y-1">
          <div
            v-for="(change, idx) in item.changes"
            :key="idx"
            class="text-xs p-1 rounded bg-gray-100 text-gray-800"
          >
            <strong>{{ change.field }}:</strong>
            <span class="line-through text-red-600">{{ change.oldValue }}</span>
            →
            <span class="text-green-600">{{ change.newValue }}</span>
          </div>
        </div>
      </div>

      <!-- IP & Device -->
      <div v-if="item.ipAddress || item.userAgent" class="mt-2 text-xs text-gray-500">
        <p v-if="item.ipAddress">IP: {{ item.ipAddress }}</p>
        <p v-if="item.userAgent" class="truncate">{{ item.userAgent.split('/')[0].substring(0, 40) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const formatDate = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const roleLabel = (role) => {
  const labels = {
    admin: 'Administrateur',
    gerant: 'Gérant',
    agent: 'Agent',
    veterinaire: 'Vétérinaire',
    comptable: 'Comptable'
  }
  return labels[role] || role
}

const severityLabel = computed(() => {
  const severity = props.item.severity
  const labels = {
    critical: '🔴 CRITIQUE',
    high: '🟠 IMPORTANT',
    medium: '🟡 NORMAL',
    low: '🟢 MINEUR'
  }
  return labels[severity] || severity?.toUpperCase()
})

const severityIcon = computed(() => {
  const severity = props.item.severity
  const icons = {
    critical: '!',
    high: '⚠',
    medium: '•',
    low: '○'
  }
  return icons[severity] || '•'
})

const severityDotClass = computed(() => {
  const severity = props.item.severity
  const classes = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-blue-500 text-white',
    low: 'bg-green-500 text-white'
  }
  return classes[severity] || 'bg-gray-500 text-white'
})

const severityBadge = computed(() => {
  const severity = props.item.severity
  const classes = {
    critical: 'bg-red-100 text-red-900',
    high: 'bg-orange-100 text-orange-900',
    medium: 'bg-blue-100 text-blue-900',
    low: 'bg-green-100 text-green-900'
  }
  return classes[severity] || 'bg-gray-100 text-gray-900'
})
</script>
