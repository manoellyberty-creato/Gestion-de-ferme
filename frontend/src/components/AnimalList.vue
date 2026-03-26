<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <button @click="router.push(`/campaigns/${campaignId}`)" class="group flex items-center text-slate-400 hover:text-blue-600 text-sm transition-all">
            <span class="mr-1 group-hover:-translate-x-1 transition-transform">←</span> Retour à la campagne
          </button>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
            Animaux
          </span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">Gestion des Animaux</h1>
        <p class="text-sm text-slate-500 flex items-center gap-2">
          <span>Campagne: {{ campaign?.name || 'Chargement...' }}</span>
        </p>
      </div>

      <div class="flex gap-3">
        <button @click="showAddForm = true"
          class="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
          <div class="flex items-center gap-2">
            <span>+</span>
            Ajouter des Animaux
          </div>
        </button>
      </div>
    </header>

    <!-- Filters -->
    <div class="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-[200px]">
          <input v-model="filters.search" @input="debouncedSearch"
            type="text" placeholder="Rechercher par nom, tag ou espèce..."
            class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <select v-model="filters.species" @change="fetchAnimals"
          class="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Toutes les espèces</option>
          <option v-for="species in availableSpecies" :key="species" :value="species">{{ species }}</option>
        </select>
        <select v-model="filters.status" @change="fetchAnimals"
          class="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Tous les statuts</option>
          <option value="VIVANT">Vivant</option>
          <option value="MORT">Mort</option>
          <option value="VENDU">Vendu</option>
        </select>
      </div>
    </div>

    <!-- Animal List -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-slate-500 animate-pulse font-medium">Chargement des animaux...</p>
    </div>

    <div v-else-if="animals.length === 0" class="text-center py-12">
      <div class="text-slate-400 text-6xl mb-4">🐄</div>
      <h3 class="text-lg font-semibold text-slate-600 mb-2">Aucun animal trouvé</h3>
      <p class="text-slate-500 mb-4">Commencez par ajouter des animaux à cette campagne.</p>
      <button @click="showAddForm = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Ajouter le premier animal
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <article v-for="animal in animals" :key="animal._id"
        @click="viewAnimalDetails(animal._id)"
        class="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group">

        <!-- QR Code -->
        <div class="flex justify-center mb-3">
          <img v-if="animal.qrCode" :src="animal.qrCode" :alt="`QR Code ${animal.tagNumber}`"
            class="w-20 h-20 object-contain rounded-lg border border-slate-100 group-hover:border-blue-200 transition-colors">
          <div v-else class="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
            <span class="text-slate-400 text-xs">QR</span>
          </div>
        </div>

        <!-- Animal Info -->
        <div class="text-center space-y-1">
          <h3 class="font-bold text-slate-800 truncate">{{ animal.name || `Animal ${animal.tagNumber}` }}</h3>
          <p class="text-sm text-slate-600">{{ animal.species }}</p>
          <p class="text-xs text-slate-500">Tag: {{ animal.tagNumber }}</p>
          <div class="flex items-center justify-center gap-2 mt-2">
            <span :class="getStatusClasses(animal.status)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase">
              {{ getStatusLabel(animal.status) }}
            </span>
          </div>
          <p v-if="animal.currentWeight" class="text-xs text-slate-500">
            Poids: {{ animal.currentWeight }} kg
          </p>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="animals.length > 0" class="flex justify-center items-center gap-2 mt-6">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
        class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
        Précédent
      </button>
      <span class="text-sm text-slate-600">
        Page {{ currentPage }} sur {{ totalPages }}
      </span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
        class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
        Suivant
      </button>
    </div>

    <!-- Add Animal Modal -->
    <AnimalForm v-if="showAddForm" :campaign-id="campaignId" :campaign="campaign"
      @close="showAddForm = false" @animal-added="onAnimalAdded" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnimalStore } from '@/stores/animal.store'
import { useCampaignStore } from '@/stores/campaign.store'
import AnimalForm from '@/components/AnimalForm.vue'

// Simple debounce function
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

const route = useRoute()
const router = useRouter()
const animalStore = useAnimalStore()
const campaignStore = useCampaignStore()

const campaignId = ref(route.params.id)
const showAddForm = ref(false)
const filters = ref({
  search: '',
  species: '',
  status: ''
})

const animals = computed(() => animalStore.animals)
const loading = computed(() => animalStore.loading)
const campaign = computed(() => campaignStore.currentCampaign)
const currentPage = computed(() => animalStore.pagination.page)
const totalPages = computed(() => Math.ceil(animalStore.pagination.total / animalStore.pagination.limit))

const availableSpecies = computed(() => {
  const species = new Set()
  animalStore.animals.forEach(animal => {
    if (animal.species) species.add(animal.species)
  })
  return Array.from(species).sort()
})

const debouncedSearch = debounce(() => {
  fetchAnimals()
}, 300)

const fetchAnimals = async () => {
  const params = {
    campaignId: campaignId.value,
    ...filters.value
  }
  Object.keys(params).forEach(key => {
    if (!params[key]) delete params[key]
  })
  await animalStore.fetchAnimals(params)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    animalStore.setPagination(page, animalStore.pagination.limit)
    fetchAnimals()
  }
}

const viewAnimalDetails = (animalId) => {
  router.push(`/animals/${animalId}`)
}

const onAnimalAdded = () => {
  showAddForm.value = false
  fetchAnimals()
}

const getStatusClasses = (status) => {
  const classes = {
    'VIVANT': 'bg-green-100 text-green-700',
    'MORT': 'bg-red-100 text-red-700',
    'VENDU': 'bg-yellow-100 text-yellow-700'
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

const getStatusLabel = (status) => {
  const labels = {
    'VIVANT': 'Vivant',
    'MORT': 'Mort',
    'VENDU': 'Vendu'
  }
  return labels[status] || status
}

onMounted(async () => {
  await campaignStore.fetchCampaignById(campaignId.value)
  await fetchAnimals()
})

watch(() => route.params.id, (newId) => {
  campaignId.value = newId
  fetchAnimals()
})
</script>