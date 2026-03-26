<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useFeed } from '../../stores/useFeed'

const props = defineProps({
  feed: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancel', 'success'])

const feedStore = useFeed()
const isLoading = ref(false)
const error = ref(null)
const isEdit = ref(!!props.feed)

const formData = ref({
  name: props.feed?.name || '',
  category: props.feed?.category || '',
  supplier: props.feed?.supplier || '',
  quantity: props.feed?.quantity || 0,
  unit: props.feed?.unit || 'kg',
  unitPrice: props.feed?.unitPrice || 0,
  expirationDate: props.feed?.expirationDate ? new Date(props.feed.expirationDate).toISOString().split('T')[0] : '',
  description: props.feed?.description || ''
})

watch(() => props.feed, (newFeed) => {
  if (newFeed) {
    isEdit.value = true
    formData.value = {
      name: newFeed.name,
      category: newFeed.category,
      supplier: newFeed.supplier,
      quantity: newFeed.quantity,
      unit: newFeed.unit,
      unitPrice: newFeed.unitPrice,
      expirationDate: newFeed.expirationDate ? new Date(newFeed.expirationDate).toISOString().split('T')[0] : '',
      description: newFeed.description
    }
  }
}, { deep: true })

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    if (isEdit.value) {
      await feedStore.updateFeed(props.feed._id, formData.value)
    } else {
      await feedStore.createFeed(formData.value)
    }
    emit('success')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Erreur lors de l\'opération'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-4">
    <!-- Nom -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
      <input
        v-model="formData.name"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ex: Aliment volaille premium"
      />
    </div>

    <!-- Catégorie -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
      <input
        v-model="formData.category"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ex: Aliments, Vaccins, Suppléments"
      />
    </div>

    <!-- Fournisseur -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Fournisseur *</label>
      <input
        v-model="formData.supplier"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Nom du fournisseur"
      />
    </div>

    <!-- Quantité et Unité (côte à côte) -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Quantité *</label>
        <input
          v-model.number="formData.quantity"
          type="number"
          required
          min="0"
          step="0.01"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Unité *</label>
        <select
          v-model="formData.unit"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choisir une unité</option>
          <option value="kg">Kilogrammes (kg)</option>
          <option value="l">Litres (L)</option>
          <option value="units">Unités</option>
          <option value="sacs">Sacs</option>
        </select>
      </div>
    </div>

    <!-- Prix unitaire -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (XOF) *</label>
      <input
        v-model.number="formData.unitPrice"
        type="number"
        required
        min="0"
        step="0.01"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="0.00"
      />
    </div>

    <!-- Date d'expiration -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
      <input
        v-model="formData.expirationDate"
        type="date"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
      <textarea
        v-model="formData.description"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Notes sur le produit..."
      ></textarea>
    </div>

    <!-- Boutons -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="isLoading"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
      >
        {{ isLoading ? 'En cours...' : isEdit ? 'Mettre à jour' : 'Créer' }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-colors font-medium"
      >
        Annuler
      </button>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
      {{ error }}
    </div>
  </form>
</template>
