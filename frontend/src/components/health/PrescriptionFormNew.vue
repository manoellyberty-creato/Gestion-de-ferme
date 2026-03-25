<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-6">
    <!-- En-tête -->
    <div class="border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? 'Modifier la prescription' : 'Nouvelle prescription' }}
      </h2>
    </div>

    <!-- Section 1: Informations de base -->
    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Informations de base</h3>
      <div class="grid grid-cols-2 gap-4">
        <!-- Sélection Animal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Animal *</label>
          <select
            v-model="formData.animal"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner un animal</option>
            <option v-for="animal in availableAnimals" :key="animal._id" :value="animal._id">
              {{ animal.name }} ({{ animal.tagNumber }})
            </option>
          </select>
        </div>

        <!-- Sélection Campagne -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Campagne *</label>
          <select
            v-model="formData.campaign"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner une campagne</option>
            <option v-for="campaign in availableCampaigns" :key="campaign._id" :value="campaign._id">
              {{ campaign.name }} ({{ campaign.type }})
            </option>
          </select>
        </div>
      </div>

      <!-- Diagnostic -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Diagnostic *</label>
        <textarea
          v-model="formData.diagnosis"
          required
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Décrivez le diagnostic..."
        ></textarea>
      </div>

      <!-- Symptômes -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Symptômes</label>
        <div class="grid grid-cols-2 gap-2">
          <label v-for="symptom in commonSymptoms" :key="symptom" class="flex items-center">
            <input
              v-model="formData.symptoms"
              :value="symptom"
              type="checkbox"
              class="mr-2"
            />
            {{ symptom }}
          </label>
        </div>
        <div class="mt-2">
          <input
            v-model="newSymptom"
            type="text"
            placeholder="Ajouter un symptôme personnalisé"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="addSymptom"
          />
        </div>
      </div>
    </div>

    <!-- Section 2: Produits prescrits -->
    <div class="border-t pt-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Produits prescrits</h3>

      <!-- Produit existants -->
      <div v-for="(product, index) in formData.prescribedProducts" :key="index" class="border rounded-lg p-4 mb-4 bg-gray-50">
        <div class="flex justify-between items-start mb-4">
          <h4 class="font-medium text-gray-900">Produit {{ index + 1 }}</h4>
          <button
            v-if="formData.prescribedProducts.length > 1"
            type="button"
            @click="removeProduct(index)"
            class="text-red-500 hover:text-red-700 font-medium"
          >
            Supprimer
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Sélection produit -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Produit de santé *</label>
            <select
              v-model="product.product"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un produit</option>
              <option v-for="healthProduct in availableProducts" :key="healthProduct._id" :value="healthProduct._id">
                {{ healthProduct.name }} ({{ healthProduct.type }})
              </option>
            </select>
          </div>

          <!-- Quantité -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantité *</label>
            <input
              v-model.number="product.quantity"
              type="number"
              required
              min="1"
              step="0.1"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1"
            />
          </div>

          <!-- Dosage -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
            <div class="flex gap-2">
              <input
                v-model.number="product.dosage.amount"
                type="number"
                required
                min="0"
                step="0.01"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
              <select
                v-model="product.dosage.unit"
                required
                class="w-24 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ml">ml</option>
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="units">units</option>
                <option value="doses">doses</option>
              </select>
            </div>
          </div>

          <!-- Fréquence -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fréquence *</label>
            <select
              v-model="product.dosage.frequency"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choisir une fréquence</option>
              <option value="once">Une fois</option>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="biweekly">Bi-hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
              <option value="as_needed">Selon besoin</option>
            </select>
          </div>

          <!-- Durée -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Durée (jours) *</label>
            <input
              v-model.number="product.dosage.duration"
              type="number"
              required
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="7"
            />
          </div>

          <!-- Notes pour ce produit -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes sur ce produit</label>
            <textarea
              v-model="product.notes"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes supplémentaires sur ce produit..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Bouton Ajouter produit -->
      <button
        type="button"
        @click="addProduct"
        class="w-full px-4 py-2 border border-dashed border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors font-medium"
      >
        + Ajouter un autre produit
      </button>
    </div>

    <!-- Section 3: Dates -->
    <div class="border-t pt-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Période de traitement</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
          <input
            v-model="formData.startDate"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
          <input
            v-model="formData.endDate"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Section 4: Notes générales -->
    <div class="border-t pt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Notes générales</label>
      <textarea
        v-model="formData.notes"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Notes supplémentaires sur la prescription..."
      ></textarea>
    </div>

    <!-- Boutons d'action -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="isLoading"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
      >
        {{ isLoading ? 'En cours...' : isEdit ? 'Mettre à jour' : 'Créer la prescription' }}
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
import { useAnimals } from '../../stores/useAnimals'
import { useCampaigns } from '../../stores/useCampaigns'

const props = defineProps({
  prescription: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancel', 'success'])

const healthStore = useHealth()
const animalStore = useAnimals()
const campaignStore = useCampaigns()

const isLoading = ref(false)
const error = ref(null)
const isEdit = ref(!!props.prescription)
const newSymptom = ref('')

const commonSymptoms = [
  'Fièvre', 'Toux', 'Écoulement nasal', 'Diarrhée', 'Constipation',
  'Perte d\'appétit', 'Lethargie', 'Abattement', 'Boiterie', 'Gonflements'
]

const availableAnimals = ref([])
const availableCampaigns = ref([])
const availableProducts = ref([])

const formData = ref({
  animal: props.prescription?.animal?._id || '',
  campaign: props.prescription?.campaign?._id || '',
  diagnosis: props.prescription?.diagnosis || '',
  symptoms: props.prescription?.symptoms || [],
  prescribedProducts: props.prescription?.prescribedProducts || [
    {
      product: '',
      quantity: 1,
      dosage: {
        amount: 0,
        unit: 'ml',
        frequency: 'daily',
        duration: 7
      },
      notes: ''
    }
  ],
  startDate: props.prescription?.startDate ? new Date(props.prescription.startDate).toISOString().split('T')[0] : '',
  endDate: props.prescription?.endDate ? new Date(props.prescription.endDate).toISOString().split('T')[0] : '',
  notes: props.prescription?.notes || ''
})

// Charger les données
const loadData = async () => {
  try {
    await healthStore.fetchProducts()
    await animalStore.fetchAnimals()
    await campaignStore.fetchCampaigns()

    availableProducts.value = healthStore.products
    availableAnimals.value = animalStore.animals
    availableCampaigns.value = campaignStore.campaigns
  } catch (err) {
    console.error('Erreur lors du chargement des données:', err)
  }
}

// Ajouter un symptôme personnalisé
const addSymptom = () => {
  if (newSymptom.value.trim() && !formData.value.symptoms.includes(newSymptom.value)) {
    formData.value.symptoms.push(newSymptom.value)
    newSymptom.value = ''
  }
}

// Ajouter un produit supplémentaire
const addProduct = () => {
  formData.value.prescribedProducts.push({
    product: '',
    quantity: 1,
    dosage: {
      amount: 0,
      unit: 'ml',
      frequency: 'daily',
      duration: 7
    },
    notes: ''
  })
}

// Supprimer un produit
const removeProduct = (index) => {
  formData.value.prescribedProducts.splice(index, 1)
}

watch(() => props.prescription, (newPrescription) => {
  if (newPrescription) {
    isEdit.value = true
    formData.value = {
      animal: newPrescription.animal?._id || '',
      campaign: newPrescription.campaign?._id || '',
      diagnosis: newPrescription.diagnosis || '',
      symptoms: newPrescription.symptoms || [],
      prescribedProducts: newPrescription.prescribedProducts || [
        {
          product: '',
          quantity: 1,
          dosage: {
            amount: 0,
            unit: 'ml',
            frequency: 'daily',
            duration: 7
          },
          notes: ''
        }
      ],
      startDate: newPrescription.startDate ? new Date(newPrescription.startDate).toISOString().split('T')[0] : '',
      endDate: newPrescription.endDate ? new Date(newPrescription.endDate).toISOString().split('T')[0] : '',
      notes: newPrescription.notes || ''
    }
  }
}, { deep: true })

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Validation
    if (!formData.value.animal) throw new Error('Sélectionnez un animal')
    if (!formData.value.campaign) throw new Error('Sélectionnez une campagne')
    if (!formData.value.diagnosis.trim()) throw new Error('Le diagnostic est requis')
    if (!formData.value.prescribedProducts.length) throw new Error('Ajoutez au moins un produit')
    if (!formData.value.startDate) throw new Error('La date de début est requise')
    if (!formData.value.endDate) throw new Error('La date de fin est requise')

    // Vérifier que la date de fin est après la date de début
    if (new Date(formData.value.endDate) <= new Date(formData.value.startDate)) {
      throw new Error('La date de fin doit être après la date de début')
    }

    const payload = {
      animal: formData.value.animal,
      campaign: formData.value.campaign,
      diagnosis: formData.value.diagnosis,
      symptoms: formData.value.symptoms,
      prescribedProducts: formData.value.prescribedProducts.map(p => ({
        product: p.product,
        quantity: Number(p.quantity),
        dosage: p.dosage,
        notes: p.notes
      })),
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      notes: formData.value.notes
    }

    if (isEdit.value) {
      await healthStore.updatePrescription(props.prescription._id, payload)
    } else {
      await healthStore.createPrescription(payload)
    }

    emit('success')
  } catch (err) {
    console.error('Erreur détaillée:', err)
    error.value = err.response?.data?.message || err.message || 'Erreur lors de l\'opération'
  } finally {
    isLoading.value = false
  }
}

loadData()
</script>
