<template>
  <div class="bg-white rounded-lg shadow-md p-6 border-t-4" :class="borderColor">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="iconBgColor">
          <span class="text-xl">{{ icon }}</span>
        </div>
        <div>
          <p class="text-sm text-gray-600">{{ label }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ period }}</p>
        </div>
      </div>
      <span v-if="trend" class="px-2 py-1 rounded text-xs font-semibold" :class="trendClass">
        {{ trend }}
      </span>
    </div>

    <!-- Main Value -->
    <div class="mb-4">
      <p class="text-3xl font-bold" :class="valueColor">{{ formatValue(value) }}</p>
    </div>

    <!-- Comparison or Breakdown -->
    <div v-if="comparison" class="mb-4 p-3 rounded" :class="comparisonBgClass">
      <p class="text-xs text-gray-600">{{ comparisonLabel }}</p>
      <p class="text-sm font-semibold" :class="comparisonTextColor">{{ formatValue(comparison) }}</p>
    </div>

    <!-- Progress Bar (for percentages) -->
    <div v-if="showProgress && maxValue" class="mb-4">
      <div class="flex justify-between mb-1">
        <span class="text-xs text-gray-600">Progress</span>
        <span class="text-xs font-semibold text-gray-900">{{ progressPercent }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all"
          :class="progressBarColor"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Footer Details -->
    <div class="text-xs text-gray-600 pt-3 border-t border-gray-100">
      <p v-if="details">{{ details }}</p>
      <p v-else>Mis à jour: {{ formatDate(updatedAt) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  icon: String,
  value: Number,
  period: {
    type: String,
    default: 'Ce mois'
  },
  type: {
    type: String,
    enum: ['revenue', 'expense', 'profit', 'margin', 'budget', 'pending'],
    default: 'revenue'
  },
  trend: String,
  comparison: Number,
  comparisonLabel: String,
  showProgress: Boolean,
  maxValue: Number,
  details: String,
  updatedAt: Date
})

const formatValue = (val) => {
  if (val === null || val === undefined) return '—'
  
  // For margin/percentage values
  if (props.type === 'margin') {
    return val.toFixed(2) + '%'
  }
  
  // For currency values
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(val)
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const borderColor = computed(() => {
  const colors = {
    revenue: 'border-green-500',
    expense: 'border-red-500',
    profit: 'border-blue-500',
    margin: 'border-purple-500',
    budget: 'border-orange-500',
    pending: 'border-yellow-500'
  }
  return colors[props.type] || 'border-gray-300'
})

const iconBgColor = computed(() => {
  const colors = {
    revenue: 'bg-green-100',
    expense: 'bg-red-100',
    profit: 'bg-blue-100',
    margin: 'bg-purple-100',
    budget: 'bg-orange-100',
    pending: 'bg-yellow-100'
  }
  return colors[props.type] || 'bg-gray-100'
})

const valueColor = computed(() => {
  const colors = {
    revenue: 'text-green-600',
    expense: 'text-red-600',
    profit: 'text-blue-600',
    margin: 'text-purple-600',
    budget: 'text-orange-600',
    pending: 'text-yellow-600'
  }
  return colors[props.type] || 'text-gray-900'
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  const isPositive = props.trend.includes('+')
  return isPositive ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
})

const comparisonBgClass = computed(() => {
  const colors = {
    revenue: 'bg-green-50',
    expense: 'bg-red-50',
    profit: 'bg-blue-50',
    margin: 'bg-purple-50',
    budget: 'bg-orange-50',
    pending: 'bg-yellow-50'
  }
  return colors[props.type] || 'bg-gray-50'
})

const comparisonTextColor = computed(() => {
  const value = props.value
  const comparison = props.comparison
  
  if (value > comparison) {
    return 'text-green-600'
  } else if (value < comparison) {
    return 'text-red-600'
  }
  return 'text-gray-900'
})

const progressPercent = computed(() => {
  if (!props.maxValue || props.maxValue === 0) return 0
  return Math.min(Math.round((props.value / props.maxValue) * 100), 100)
})

const progressBarColor = computed(() => {
  const percent = progressPercent.value
  if (percent >= 100) return 'bg-red-500'
  if (percent >= 80) return 'bg-orange-500'
  if (percent >= 50) return 'bg-blue-500'
  return 'bg-green-500'
})
</script>
