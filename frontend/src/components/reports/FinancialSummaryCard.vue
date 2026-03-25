<script setup>
defineProps({
  totalIncome: {
    type: Number,
    default: 0
  },
  totalExpense: {
    type: Number,
    default: 0
  },
  netProfit: {
    type: Number,
    default: 0
  },
  profitMargin: {
    type: Number,
    default: 0
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Revenu -->
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
      <p class="text-gray-600 text-sm font-medium">Revenu Total</p>
      <p class="text-2xl font-bold text-green-600 mt-2">{{ formatCurrency(totalIncome) }}</p>
      <p class="text-xs text-gray-500 mt-1">Entrées de fonds</p>
    </div>

    <!-- Total Dépense -->
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
      <p class="text-gray-600 text-sm font-medium">Dépense Total</p>
      <p class="text-2xl font-bold text-red-600 mt-2">{{ formatCurrency(totalExpense) }}</p>
      <p class="text-xs text-gray-500 mt-1">Sorties de fonds</p>
    </div>

    <!-- Profit Net -->
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <p class="text-gray-600 text-sm font-medium">Profit Net</p>
      <p :class="['text-2xl font-bold mt-2', netProfit >= 0 ? 'text-blue-600' : 'text-red-600']">
        {{ formatCurrency(netProfit) }}
      </p>
      <p class="text-xs text-gray-500 mt-1">Résultat net</p>
    </div>

    <!-- Marge Bénéficiaire -->
    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
      <p class="text-gray-600 text-sm font-medium">Marge Bénéf.</p>
      <p :class="['text-2xl font-bold mt-2', profitMargin >= 0 ? 'text-purple-600' : 'text-red-600']">
        {{ profitMargin.toFixed(2) }}%
      </p>
      <p class="text-xs text-gray-500 mt-1">Rentabilité</p>
    </div>
  </div>
</template>
