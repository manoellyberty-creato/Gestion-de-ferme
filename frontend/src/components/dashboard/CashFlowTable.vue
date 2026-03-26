<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-bold mb-4">Flux de trésorerie (6 derniers mois)</h3>
    <div v-if="cashFlow.length === 0" class="py-8 text-center text-gray-500">
      Aucune donnée disponible
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-3 py-2">Période</th>
            <th class="px-3 py-2 text-right">Total Recettes</th>
            <th class="px-3 py-2 text-right">Total Dépenses</th>
            <th class="px-3 py-2 text-right">Profit</th>
            <th class="px-3 py-2 text-right">Transactions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="item in cashFlow" :key="item.period" class="hover:bg-gray-50">
            <td class="px-3 py-2">{{ item.period }}</td>
            <td class="px-3 py-2 text-right text-green-700 font-semibold">{{ formatCurrency(item.income) }}</td>
            <td class="px-3 py-2 text-right text-red-700 font-semibold">{{ formatCurrency(item.expense) }}</td>
            <td class="px-3 py-2 text-right" :class="item.income - item.expense >= 0 ? 'text-blue-700 font-semibold' : 'text-red-700 font-semibold'">
              {{ formatCurrency(item.income - item.expense) }}
            </td>
            <td class="px-3 py-2 text-right">{{ item.transactions }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cashFlow: {
    type: Array,
    default: () => []
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
