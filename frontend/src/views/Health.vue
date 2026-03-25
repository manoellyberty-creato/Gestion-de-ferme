<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHealth } from '../stores/useHealth'
import HealthProductCard from '../components/health/HealthProductCard.vue'
import HealthProductForm from '../components/health/HealthProductForm.vue'
import PrescriptionCard from '../components/health/PrescriptionCard.vue'
import PrescriptionForm from '../components/health/PrescriptionForm.vue'

const healthStore = useHealth()
const activeTab = ref('products')
const showProductForm = ref(false)
const showPrescriptionForm = ref(false)
const editingProduct = ref(null)
const editingPrescription = ref(null)
const searchProductsQuery = ref('')
const filterStatus = ref('')

const filteredPrescriptions = computed(() => {
  return healthStore.prescriptions.filter(p => {
    if (filterStatus.value && p.status !== filterStatus.value) return false
    return true
  })
})

const loadProducts = async () => {
  try {
    if (searchProductsQuery.value) {
      // Implémenter recherche si backend le supporte
    } else {
      await healthStore.fetchProducts()
    }
  } catch (err) {
    console.error('Erreur:', err)
  }
}

const loadPrescriptions = async () => {
  try {
    await healthStore.fetchPrescriptions()
  } catch (err) {
    console.error('Erreur:', err)
  }
}

const handleEditProduct = (product) => {
  editingProduct.value = product
  showProductForm.value = true
}

const handleDeleteProduct = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await healthStore.deleteProduct(id)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }
}

const handleProductFormSuccess = () => {
  closeProductForm()
  loadProducts()
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
}

const handleEditPrescription = (prescription) => {
  editingPrescription.value = prescription
  showPrescriptionForm.value = true
}

const handleDeletePrescription = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette prescription ?')) {
    try {
      await healthStore.deletePrescription(id)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }
}

const handlePrescriptionFormSuccess = () => {
  closePrescriptionForm()
  loadPrescriptions()
}

const closePrescriptionForm = () => {
  showPrescriptionForm.value = false
  editingPrescription.value = null
}

onMounted(() => {
  loadProducts()
  loadPrescriptions()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Gestion de la Santé Animale</h1>
      <p class="text-gray-600 mt-1">Produits de santé, prescriptions et suivi vétérinaire</p>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-md border-b">
      <div class="flex">
        <button
          @click="activeTab = 'products'"
          :class="[
            'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
            activeTab === 'products'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          Produits ({{ healthStore.productCount }})
        </button>
        <button
          @click="activeTab = 'prescriptions'"
          :class="[
            'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
            activeTab === 'prescriptions'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          Prescriptions ({{ healthStore.prescriptionCount }})
        </button>
      </div>
    </div>

    <!-- TAB 1: PRODUITS -->
    <div v-show="activeTab === 'products'" class="space-y-6">
      <!-- Header produits -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Produits de Santé</h2>
        <button
          @click="showProductForm = true"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          + Ajouter un produit
        </button>
      </div>

      <!-- Recherche produits -->
      <div class="bg-white rounded-lg shadow p-4">
        <input
          v-model="searchProductsQuery"
          type="text"
          placeholder="Rechercher un produit..."
          @keyup.enter="loadProducts"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Chargement -->
      <div v-if="healthStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Chargement des produits...</p>
      </div>

      <!-- Liste produits -->
      <div v-else-if="healthStore.products.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-500">Aucun produit trouvé</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthProductCard
          v-for="product in healthStore.products"
          :key="product._id"
          :product="product"
          @edit="handleEditProduct(product)"
          @delete="handleDeleteProduct(product._id)"
        />
      </div>

      <!-- Modal formulaire produit -->
      <transition name="modal">
        <div v-if="showProductForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 class="text-xl font-bold">{{ editingProduct ? 'Éditer le produit' : 'Ajouter un produit' }}</h2>
              <button @click="closeProductForm" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div class="p-6">
              <HealthProductForm
                :product="editingProduct"
                @cancel="closeProductForm"
                @success="handleProductFormSuccess"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- TAB 2: PRESCRIPTIONS -->
    <div v-show="activeTab === 'prescriptions'" class="space-y-6">
      <!-- Header prescriptions -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Prescriptions</h2>
        <button
          @click="showPrescriptionForm = true"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          + Ajouter une prescription
        </button>
      </div>

      <!-- Filtrage prescriptions -->
      <div class="bg-white rounded-lg shadow p-4">
        <select
          v-model="filterStatus"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="completed">Terminé</option>
        </select>
      </div>

      <!-- Chargement -->
      <div v-if="healthStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Chargement des prescriptions...</p>
      </div>

      <!-- Liste prescriptions -->
      <div v-else-if="filteredPrescriptions.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-500">Aucune prescription trouvée</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PrescriptionCard
          v-for="prescription in filteredPrescriptions"
          :key="prescription._id"
          :prescription="prescription"
          @edit="handleEditPrescription(prescription)"
          @delete="handleDeletePrescription(prescription._id)"
        />
      </div>

      <!-- Modal formulaire prescription -->
      <transition name="modal">
        <div v-if="showPrescriptionForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 class="text-xl font-bold">{{ editingPrescription ? 'Éditer la prescription' : 'Ajouter une prescription' }}</h2>
              <button @click="closePrescriptionForm" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div class="p-6">
              <PrescriptionForm
                :prescription="editingPrescription"
                @cancel="closePrescriptionForm"
                @success="handlePrescriptionFormSuccess"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>

  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
