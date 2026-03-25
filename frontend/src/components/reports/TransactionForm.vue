<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Type -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <select
        v-model="formData.type"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">-- Sélectionner --</option>
        <option value="income">Revenu</option>
        <option value="expense">Dépense</option>
      </select>
      <span v-if="errors.type" class="text-red-500 text-xs mt-1">{{ errors.type }}</span>
    </div>

    <!-- Category -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
      <input
        v-model="formData.category"
        type="text"
        placeholder="Ex: Alimentation, Vétérinaire..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <span v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</span>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <input
        v-model="formData.description"
        type="text"
        placeholder="Description de la transaction"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <span v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</span>
    </div>

    <!-- Amount -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Montant (XOF)</label>
      <input
        v-model.number="formData.amount"
        type="number"
        placeholder="0"
        min="0"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <span v-if="errors.amount" class="text-red-500 text-xs mt-1">{{ errors.amount }}</span>
    </div>

    <!-- Date -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
        v-model="formData.date"
        type="date"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <span v-if="errors.date" class="text-red-500 text-xs mt-1">{{ errors.date }}</span>
    </div>

    <!-- Campagne -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Campagne (Optionnel)</label>
      <input
        v-model="formData.campaign"
        type="text"
        placeholder="ID de la campagne"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Annuler
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
      >
        {{ loading ? 'Enregistrement...' : transaction ? 'Mettre à jour' : 'Créer' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel', 'success'])

const formData = ref({
  type: '',
  category: '',
  description: '',
  amount: null,
  date: new Date().toISOString().split('T')[0],
  campaign: ''
})

const errors = ref({})

watch(() => props.transaction, (newVal) => {
  if (newVal) {
    formData.value = {
      type: newVal.type || '',
      category: newVal.category || '',
      description: newVal.description || '',
      amount: newVal.amount || null,
      date: newVal.date ? newVal.date.split('T')[0] : new Date().toISOString().split('T')[0],
      campaign: newVal.campaign || ''
    }
  }
}, { immediate: true })

const validateForm = () => {
  errors.value = {}
  if (!formData.value.type) errors.value.type = 'Requis'
  if (!formData.value.category) errors.value.category = 'Requis'
  if (!formData.value.description) errors.value.description = 'Requis'
  if (!formData.value.amount || formData.value.amount <= 0) errors.value.amount = 'Montant invalide'
  if (!formData.value.date) errors.value.date = 'Requis'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  try {
    emit('success', formData.value)
  } catch (err) {
    console.error('Erreur:', err)
  }
}
</script>
