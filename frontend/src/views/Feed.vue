<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFeed } from '../stores/useFeed'
import FeedCard from '../components/feed/FeedCard.vue'
import FeedForm from '../components/feed/FeedForm.vue'

const feedStore = useFeed()
const showForm = ref(false)
const editingFeed = ref(null)
const searchQuery = ref('')
const filterCategory = ref('')
const stats = ref(null)

const displayedFeeds = computed(() => {
  return feedStore.feeds.filter(feed => {
    const matchesSearch = !searchQuery.value || 
      feed.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      feed.supplier.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = !filterCategory.value || feed.category === filterCategory.value
    
    return matchesSearch && matchesCategory
  })
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount || 0)
}

const loadData = async () => {
  try {
    await feedStore.fetchFeeds()
    stats.value = await feedStore.fetchStats()
  } catch (err) {
    console.error('Erreur lors du chargement:', err)
  }
}

const handleSearch = async () => {
  if (searchQuery.value) {
    try {
      const results = await feedStore.searchFeeds(searchQuery.value)
      feedStore.feeds = results
    } catch (err) {
      console.error('Erreur de recherche:', err)
    }
  } else {
    await loadData()
  }
}

const handleEdit = (feed) => {
  editingFeed.value = feed
  showForm.value = true
}

const handleDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await feedStore.deleteFeed(id)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }
}

const handleFormSuccess = () => {
  closeForm()
  loadData()
}

const closeForm = () => {
  showForm.value = false
  editingFeed.value = null
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Produits Alimentaires</h1>
        <p class="text-gray-600 mt-1">Gérez vos stocks et alimentations</p>
      </div>
      <button
        @click="showForm = true"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
      >
        + Ajouter un produit
      </button>
    </div>

    <!-- Stats cards -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-gray-600 text-sm">Total produits</p>
        <p class="text-2xl font-bold mt-2">{{ stats.totalProducts }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-gray-600 text-sm">Stock faible</p>
        <p class="text-2xl font-bold text-yellow-600 mt-2">{{ stats.lowStockCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-gray-600 text-sm">Expiration proche</p>
        <p class="text-2xl font-bold text-red-600 mt-2">{{ stats.expiringCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-gray-600 text-sm">Valeur stock</p>
        <p class="text-2xl font-bold text-blue-600 mt-2">{{ formatCurrency(stats.totalValue) }}</p>
      </div>
    </div>

    <!-- Filtrage et recherche -->
    <div class="bg-white rounded-lg shadow p-4 space-y-4">
      <div class="flex gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un produit..."
          @keyup.enter="handleSearch"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Toutes les catégories</option>
          <option value="Aliments">Aliments</option>
          <option value="Vaccins">Vaccins</option>
          <option value="Suppléments">Suppléments</option>
          <option value="Minéraux">Minéraux</option>
        </select>
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Rechercher
        </button>
      </div>
    </div>

    <!-- Liste des produits -->
    <div v-if="feedStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">Chargement...</p>
    </div>

    <div v-else-if="displayedFeeds.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500">Aucun produit trouvé</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeedCard
        v-for="feed in displayedFeeds"
        :key="feed._id"
        :feed="feed"
        @edit="handleEdit(feed)"
        @delete="handleDelete(feed._id)"
      />
    </div>

    <!-- Modal formulaire -->
    <transition name="modal">
      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
          <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ editingFeed ? 'Éditer le produit' : 'Ajouter un produit' }}</h2>
            <button @click="closeForm" class="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div class="p-6">
            <FeedForm
              :feed="editingFeed"
              @cancel="closeForm"
              @success="handleFormSuccess"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Message d'erreur global -->
    <div v-if="feedStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ feedStore.error }}
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
