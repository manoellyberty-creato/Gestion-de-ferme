<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full">
      <thead class="bg-gray-50 border-b">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Catégorie</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Montant</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-for="transaction in transactions" :key="transaction._id" class="hover:bg-gray-50">
          <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(transaction.date) }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.description }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ transaction.category }}</td>
          <td class="px-6 py-4 text-sm">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                transaction.type === 'income'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ transaction.type === 'income' ? 'Revenu' : 'Dépense' }}
            </span>
          </td>
          <td
            :class="[
              'px-6 py-4 text-sm font-semibold text-right',
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ formatCurrency(transaction.amount) }}
          </td>
          <td class="px-6 py-4 text-sm text-center">
            <div class="flex gap-2 justify-center">
              <button
                @click="$emit('edit', transaction)"
                class="text-blue-600 hover:text-blue-800 font-medium text-xs"
              >
                Éditer
              </button>
              <button
                @click="$emit('delete', transaction._id)"
                class="text-red-600 hover:text-red-800 font-medium text-xs"
              >
                Supprimer
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="transactions.length === 0" class="p-12 text-center">
      <p class="text-gray-500">Aucune transaction trouvée</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['edit', 'delete'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}
</script>
