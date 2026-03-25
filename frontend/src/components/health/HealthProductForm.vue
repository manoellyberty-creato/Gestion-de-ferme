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
        placeholder="Ex: Pénicilline 500mg"
      />
    </div>

    <!-- Type et Catégorie (côte à côte) -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
        <select
          v-model="formData.type"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choisir un type</option>
          <option value="vaccine">Vaccin</option>
          <option value="treatment">Traitement</option>
          <option value="supplement">Supplément</option>
          <option value="antibiotic">Antibiotique</option>
          <option value="antiparasitic">Antiparasitaire</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
        <select
          v-model="formData.category"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choisir une catégorie</option>
          <option value="preventive">Préventif</option>
          <option value="curative">Curatif</option>
          <option value="nutritional">Nutritionnel</option>
        </select>
      </div>
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

    <!-- Espèces cibles -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Espèces cibles *</label>
      <div class="grid grid-cols-2 gap-2">
        <label v-for="species in availableSpecies" :key="species.value" class="flex items-center">
          <input
            v-model="formData.targetSpecies"
            :value="species.value"
            type="checkbox"
            class="mr-2"
          />
          {{ species.label }}
        </label>
      </div>
    </div>

    <!-- Dosage -->
    <div class="border-t pt-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Dosage recommandé</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Quantité *</label>
          <input
            v-model.number="formData.dosage.amount"
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
            v-model="formData.dosage.unit"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choisir une unité</option>
            <option value="ml">Millilitres (ml)</option>
            <option value="mg">Milligrammes (mg)</option>
            <option value="g">Grammes (g)</option>
            <option value="units">Unités</option>
            <option value="doses">Doses</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fréquence *</label>
          <select
            v-model="formData.dosage.frequency"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choisir une fréquence</option>
            <option value="once">Une fois</option>
            <option value="daily">Quotidien</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
            <option value="as_needed">Selon besoin</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Durée (jours) *</label>
          <input
            v-model.number="formData.dosage.duration"
            type="number"
            required
            min="1"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="7"
          />
        </div>
      </div>
    </div>

    <!-- Efficacité et Prix -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Efficacité (%) *</label>
        <input
          v-model.number="formData.effectiveness"
          type="number"
          required
          min="0"
          max="100"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="95"
        />
      </div>
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
    </div>

    <!-- Numéro de lot et Date d'expiration -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de lot *</label>
        <input
          v-model="formData.batchNumber"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="LOT-2024-001"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Date d'expiration *</label>
        <input
          v-model="formData.expirationDate"
          type="date"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
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

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useHealth } from '../../stores/useHealth'

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancel', 'success'])

const healthStore = useHealth()
const isLoading = ref(false)
const error = ref(null)
const isEdit = ref(!!props.product)

// Liste des espèces disponibles
const availableSpecies = [
  { value: 'poultry', label: 'Volaille' },
  { value: 'cattle', label: 'Bétail' },
  { value: 'chicken', label: 'Poulet' },
  { value: 'duck', label: 'Canard' },
  { value: 'guinea_fowl', label: 'Pintade' },
  { value: 'pigeon', label: 'Pigeon' },
  { value: 'fish', label: 'Poisson' },
  { value: 'dairy_cattle', label: 'Bétail laitier' },
  { value: 'beef_cattle', label: 'Bétail de boucherie' },
  { value: 'sheep', label: 'Mouton' }
]

const formData = ref({
  name: props.product?.name || '',
  type: props.product?.type || '',
  category: props.product?.category || '',
  supplier: props.product?.supplier || '',
  targetSpecies: props.product?.targetSpecies || [],
  dosage: {
    amount: props.product?.dosage?.amount || 0,
    unit: props.product?.dosage?.unit || 'ml',
    frequency: props.product?.dosage?.frequency || 'daily',
    duration: props.product?.dosage?.duration || 1
  },
  effectiveness: props.product?.effectiveness || 90,
  unitPrice: props.product?.unitPrice || 0,
  batchNumber: props.product?.batchNumber || '',
  expirationDate: props.product?.expirationDate ? new Date(props.product.expirationDate).toISOString().split('T')[0] : '',
  description: props.product?.description || '',
  sideEffects: props.product?.sideEffects || []
})

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    isEdit.value = true
    formData.value = {
      name: newProduct.name,
      type: newProduct.type,
      category: newProduct.category,
      supplier: newProduct.supplier,
      targetSpecies: newProduct.targetSpecies || [],
      dosage: {
        amount: newProduct.dosage?.amount || 0,
        unit: newProduct.dosage?.unit || 'ml',
        frequency: newProduct.dosage?.frequency || 'daily',
        duration: newProduct.dosage?.duration || 1
      },
      effectiveness: newProduct.effectiveness || 90,
      unitPrice: newProduct.unitPrice,
      batchNumber: newProduct.batchNumber || '',
      expirationDate: newProduct.expirationDate ? new Date(newProduct.expirationDate).toISOString().split('T')[0] : '',
      description: newProduct.description || '',
      sideEffects: newProduct.sideEffects || []
    }
  }
}, { deep: true })

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Validation des champs requis
    if (!formData.value.name.trim()) throw new Error("Le nom du produit est requis")
    if (!formData.value.type) throw new Error("Le type de produit est requis")
    if (!formData.value.category) throw new Error("La catégorie est requise")
    if (!formData.value.supplier.trim()) throw new Error("Le fournisseur est requis")
    if (!formData.value.targetSpecies.length) throw new Error("Au moins une espèce cible est requise")
    if (!formData.value.dosage.amount || formData.value.dosage.amount <= 0) throw new Error("Le dosage doit être supérieur à 0")
    if (!formData.value.dosage.unit) throw new Error("L'unité de dosage est requise")
    if (!formData.value.dosage.frequency) throw new Error("La fréquence de dosage est requise")
    if (!formData.value.dosage.duration || formData.value.dosage.duration <= 0) throw new Error("La durée doit être supérieure à 0")
    if (!formData.value.effectiveness || formData.value.effectiveness < 0 || formData.value.effectiveness > 100) throw new Error("L'efficacité doit être entre 0 et 100")
    if (!formData.value.unitPrice || formData.value.unitPrice < 0) throw new Error("Le prix unitaire doit être positif")
    if (!formData.value.batchNumber.trim()) throw new Error("Le numéro de lot est requis")
    if (!formData.value.expirationDate) throw new Error("La date d'expiration est requise")

    // Formatage des données
    const payload = {
      ...formData.value,
      unitPrice: Number(formData.value.unitPrice),
      effectiveness: Number(formData.value.effectiveness),
      dosage: {
        ...formData.value.dosage,
        amount: Number(formData.value.dosage.amount),
        duration: Number(formData.value.dosage.duration)
      },
      sideEffects: formData.value.sideEffects || []
    }

    if (isEdit.value) {
      if (!props.product?._id) throw new Error("ID du produit manquant")
      await healthStore.updateProduct(props.product._id, payload)
    } else {
      await healthStore.createProduct(payload)
    }

    emit('success')
  } catch (err) {
    console.error("Erreur détaillée:", err)
    error.value = err.response?.data?.message || err.message || 'Erreur lors de l\'opération'
  } finally {
    isLoading.value = false
  }
}
</script>
