<template>
  <div class="bg-white rounded-lg shadow-md p-6 border-l-4" :class="varianceBorder">
    <div class="mb-4">
      <h3 class="font-semibold text-gray-900 mb-1">Budget vs Actual</h3>
      <p class="text-xs text-gray-600">Campagne: {{ campaignName }}</p>
    </div>

    <!-- Budget Overview -->
    <div class="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
      <div>
        <p class="text-xs text-gray-600 mb-1">Budget Alloué</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(budget) }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-600 mb-1">Dépensé</p>
        <p class="text-2xl font-bold" :class="spentColor">{{ formatCurrency(spent) }}</p>
      </div>
    </div>

    <!-- Variance Analysis -->
    <div class="mb-6 pb-6 border-b border-gray-100">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-gray-700">Variance</span>
        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="varianceBadge">
          {{ varianceLabel }}
        </span>
      </div>
      <p class="text-3xl font-bold" :class="varianceColor">{{ formatCurrency(variance) }}</p>
      <p class="text-xs text-gray-600 mt-1">{{ variancePercent }}% versus budget</p>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between mb-1">
        <span class="text-xs text-gray-600">% du budget utilisé</span>
        <span class="text-xs font-semibold text-gray-900">{{ budgetUsagePercent }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="h-3 rounded-full transition-all"
          :class="progressBarColor"
          :style="{ width: budgetUsagePercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Status Indicators -->
    <div class="grid grid-cols-2 gap-3 mb-6 text-xs">
      <div class="p-3 rounded" :class="remainingClass">
        <p class="text-gray-600">Restant</p>
        <p class="text-lg font-bold">{{ formatCurrency(remaining) }}</p>
      </div>
      <div class="p-3 rounded" :class="statusClass">
        <p class="text-gray-600">État</p>
        <p class="text-lg font-bold">{{ budgetStatus }}</p>
      </div>
    </div>

    <!-- Breakdown by Category -->
    <div v-if="categories && categories.length > 0" class="border-t border-gray-100 pt-4">
      <p class="text-xs font-semibold text-gray-700 mb-3">Dépenses par Catégorie</p>
      <div class="space-y-2">
        <div
          v-for="category in categories"
          :key="category.name"
          class="flex items-center justify-between text-xs"
        >
          <div class="flex items-center gap-2 flex-1">
            <div class="w-16 h-2 rounded-full bg-gray-200">
              <div
                class="h-2 rounded-full transition-all"
                :class="getCategoryColor(category.percentage)"
                :style="{ width: category.percentage + '%' }"
              ></div>
            </div>
            <span class="text-gray-600">{{ category.name }}</span>
          </div>
          <span class="font-semibold text-gray-900">{{ category.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="mt-6">
      <button
        @click="$emit('reconcile')"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
      >
        📊 Réconcilier
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  budget: {
    type: Number,
    default: 0
  },
  spent: {
    type: Number,
    default: 0
  },
  campaignName: {
    type: String,
    default: 'N/A'
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['reconcile'])

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const variance = computed(() => props.budget - props.spent)

const remaining = computed(() => Math.max(0, variance.value))

const budgetUsagePercent = computed(() => {
  if (props.budget === 0) return 0
  return Math.round((props.spent / props.budget) * 100)
})

const variancePercent = computed(() => {
  if (props.budget === 0) return 0
  return Math.round((variance.value / props.budget) * 100)
})

const isOverBudget = computed(() => variance.value < 0)

const isWellManaged = computed(() => budgetUsagePercent.value <= 80)

const budgetStatus = computed(() => {
  if (isOverBudget.value) return '⚠️ Over'
  if (budgetUsagePercent.value > 90) return '🟡 Critical'
  if (budgetUsagePercent.value > 75) return '🟠 High'
  return '🟢 Ok'
})

const spentColor = computed(() => {
  if (isOverBudget.value) return 'text-red-600 font-bold'
  if (budgetUsagePercent.value > 90) return 'text-orange-600'
  return 'text-gray-900'
})

const varianceColor = computed(() => {
  if (isOverBudget.value) return 'text-red-600'
  if (budgetUsagePercent.value <= 80) return 'text-green-600'
  return 'text-orange-600'
})

const varianceBorder = computed(() => {
  if (isOverBudget.value) return 'border-red-500'
  if (budgetUsagePercent.value <= 80) return 'border-green-500'
  return 'border-orange-500'
})

const varianceLabel = computed(() => {
  if (isOverBudget.value) return '❌ Dépassement'
  if (budgetUsagePercent.value <= 80) return '✅ Bon'
  return '⚠️ Élevé'
})

const varianceBadge = computed(() => {
  if (isOverBudget.value) return 'bg-red-100 text-red-900'
  if (budgetUsagePercent.value <= 80) return 'bg-green-100 text-green-900'
  return 'bg-orange-100 text-orange-900'
})

const progressBarColor = computed(() => {
  if (isOverBudget.value) return 'bg-red-500'
  if (budgetUsagePercent.value > 90) return 'bg-orange-500'
  if (budgetUsagePercent.value > 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

const remainingClass = computed(() => {
  if (remaining.value > 0) return 'bg-green-50 border border-green-200'
  return 'bg-red-50 border border-red-200'
})

const statusClass = computed(() => {
  if (isOverBudget.value) return 'bg-red-50 border border-red-200'
  if (budgetUsagePercent.value > 90) return 'bg-orange-50 border border-orange-200'
  return 'bg-green-50 border border-green-200'
})

const getCategoryColor = (percentage) => {
  if (percentage > 80) return 'bg-red-500'
  if (percentage > 60) return 'bg-orange-500'
  if (percentage > 40) return 'bg-blue-500'
  return 'bg-green-500'
}
</script>
