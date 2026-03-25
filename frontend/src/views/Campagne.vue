<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useCampaignStore } from '@/stores/campaign.store.js'
import CampaignFilterBar from '@/components/CampaignFilterBar.vue'
import { notifyError, notifySuccess } from '@/utils/notifications'

const store = useCampaignStore()
const loading = ref(true)
const error = ref(null)

// État des filtres synchronisé avec CampaignFilterBar
const filters = ref({
  category: '',
  department: '',
  search: ''
})

// Cache roles for each campaign (computed to avoid multiple calls)
const campaignsWithRoles = computed(() => {
  return (store.campaigns || []).map(campaign => ({
    ...campaign,
    roles: {
      hasVeto: campaign.assignedAgents?.some(a => a.role === 'veterinaire') ?? false,
      hasComptable: campaign.assignedAgents?.some(a => a.role === 'comptable') ?? false,
      hasAgent: campaign.assignedAgents?.some(a => a.role === 'agent') ?? false,
      hasManager: campaign.assignedAgents?.some(a => a.role === 'manager') ?? false,
      hasAny: (campaign.assignedAgents?.length ?? 0) > 0
    }
  }))
})

// Get category name safely
const getCategoryName = (campaign) => {
  if (!campaign) return 'N/A'
  if (campaign.categoryId?.name) return campaign.categoryId.name
  if (typeof campaign.categoryId === 'string') return campaign.categoryId
  return 'Sans catégorie'
}

// Get department name safely
const getDepartmentName = (campaign) => {
  if (!campaign) return 'N/A'
  if (campaign.department?.name) return campaign.department.name
  if (typeof campaign.department === 'string') return campaign.department
  return 'Non défini'
}

// Date formatter
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Load data from store
const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    await store.fetchCampaigns(filters.value)
  } catch (err) {
    error.value = err?.message || 'Erreur lors du chargement des campagnes'
    notifyError(error.value)
    console.error('Campaign load error:', err)
  } finally {
    loading.value = false
  }
}

// Initial data load
onMounted(async () => {
  try {
    await Promise.all([
      store.fetchCategories(),
      store.fetchDepartments()
    ])
    await loadData()
  } catch (err) {
    error.value = 'Erreur lors de l\'initialisation'
    notifyError(error.value)
  }
})

// Watch filters with debounce
let filterTimeout
const watchFilters = () => {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    loadData()
  }, 300)
}

watch(filters, watchFilters, { deep: true })

// Handle campaign deletion
const deleteCampaign = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) return
  try {
    await store.deleteCampaign(id)
    notifySuccess('Campagne supprimée avec succès')
    await loadData()
  } catch (err) {
    notifyError('Erreur lors de la suppression')
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Campagnes</h1>
        <p class="text-sm text-slate-500 mt-1">Organisez et pilotez vos opérations agricoles.</p>
      </div>

      <router-link to="/campaigns/create"
        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Nouvelle Campagne
      </router-link>
    </div>

    <!-- Filters -->
    <CampaignFilterBar v-model="filters" />

    <!-- Error State -->
    <div v-if="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
      </svg>
      <div>
        <p class="text-red-800 font-semibold">Erreur</p>
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Campagne</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Localisation</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Dates</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Équipe</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 3" :key="`skeleton-${i}`" class="animate-pulse">
              <td class="p-4">
                <div class="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-slate-50 rounded w-1/2"></div>
              </td>
              <td class="p-4">
                <div class="h-6 bg-slate-50 rounded w-24 mb-2"></div>
                <div class="h-4 bg-slate-50 rounded w-16"></div>
              </td>
              <td class="p-4">
                <div class="h-4 bg-slate-50 rounded w-20"></div>
              </td>
              <td class="p-4">
                <div class="flex -space-x-2">
                  <div class="h-6 w-6 rounded-full bg-slate-100 border-2 border-white"></div>
                  <div class="h-6 w-6 rounded-full bg-slate-50 border-2 border-white"></div>
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="h-4 bg-slate-100 rounded w-10 ml-auto"></div>
              </td>
            </tr>
          </template>

          <!-- Data Rows -->
          <template v-else>
            <tr v-for="item in campaignsWithRoles" :key="item._id" class="hover:bg-slate-50/80 transition-colors">
              <!-- Campaign Name -->
              <td class="p-4">
                <p class="font-semibold text-slate-900">{{ item.name }}</p>
                <p class="text-xs text-slate-500 mt-1">ID: {{ item._id?.slice(-8) }}</p>
              </td>

              <!-- Localisation -->
              <td class="p-4">
                <div class="space-y-1">
                  <span class="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                    {{ getDepartmentName(item) }}
                  </span>
                  <p class="text-xs text-slate-600">{{ getCategoryName(item) }}</p>
                </div>
              </td>

              <!-- Dates -->
              <td class="p-4 text-sm">
                <div class="space-y-1">
                  <p class="text-slate-700 font-medium">{{ formatDate(item.startDate) }}</p>
                  <p class="text-slate-500 text-xs">→ {{ formatDate(item.expectedEndDate) }}</p>
                </div>
              </td>

              <!-- Team (Roles) -->
              <td class="p-4">
                <div class="flex -space-x-2">
                  <!-- Vétérinaire -->
                  <div v-if="item.roles.hasVeto" 
                    title="Vétérinaire"
                    class="h-8 w-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-700 hover:scale-110 transition-transform cursor-help">
                    V
                  </div>

                  <!-- Comptable -->
                  <div v-if="item.roles.hasComptable"
                    title="Comptable"
                    class="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700 hover:scale-110 transition-transform cursor-help">
                    C
                  </div>

                  <!-- Agent -->
                  <div v-if="item.roles.hasAgent"
                    title="Agent"
                    class="h-8 w-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-700 hover:scale-110 transition-transform cursor-help">
                    A
                  </div>

                  <!-- Manager -->
                  <div v-if="item.roles.hasManager"
                    title="Manager"
                    class="h-8 w-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-700 hover:scale-110 transition-transform cursor-help">
                    M
                  </div>

                  <!-- No Team -->
                  <div v-if="!item.roles.hasAny" class="text-xs text-slate-400 italic">
                    Aucune
                  </div>
                </div>
              </td>

              <!-- Actions -->
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="`/campaigns/${item._id}`"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Gérer la campagne">
                    Gérer
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </router-link>
                  
                  <button
                    @click="deleteCampaign(item._id)"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer la campagne">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-if="!loading && campaignsWithRoles.length === 0">
            <td colspan="5" class="p-12 text-center">
              <div class="inline-flex flex-col items-center justify-center">
                <svg class="w-16 h-16 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m7.5-2.25a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-slate-600 font-medium text-lg mb-1">Aucune campagne</p>
                <p class="text-slate-400 text-sm mb-4">Commencez par créer une nouvelle campagne pour démarrer.</p>
                <router-link to="/campaigns/create" 
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Créer une campagne
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
tr {
  transition: background-color 0.2s ease-in-out;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
