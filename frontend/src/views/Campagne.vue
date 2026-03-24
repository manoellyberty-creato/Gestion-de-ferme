<script setup>
import { onMounted, ref, watch } from 'vue'
import { useCampaignStore } from '@/stores/campaign.store.js'
import CampaignFilterBar from '@/components/CampaignFilterBar.vue'

const store = useCampaignStore()
const loading = ref(true)

// État des filtres synchronisé avec CampaignFilterBar
const filters = ref({
  category: '',
  department: '',
  search: ''
})

// Fonction utilitaire pour vérifier un rôle dans le tableau assignedAgents
const hasRole = (item, roleName) => {
  return item.assignedAgents?.some(agent => agent.role === roleName)
}

// Computed pour le nom de la catégorie
const getCategoryName = (campaign) => {
  if (!campaign) return 'N/A'
  if (campaign.categoryId?.name) return campaign.categoryId.name
  return 'Sans catégorie'
}

// Computed pour le nom du département
const getDepartmentName = (campaign) => {
  if (!campaign) return 'N/A'
  if (campaign.department?.name) return campaign.department.name
  return 'Non défini'
}

// Formatage de la date
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Chargement des données via le Store
const loadData = async () => {
  loading.value = true
  try {
    const response = await store.fetchCampaigns(filters.value)
    // Le store gère les données automatiquement
    return response
  } catch (error) {
    console.error("Erreur chargement campagnes:", error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Charger catégories et départements pour les filtres
  await Promise.all([
    store.fetchCategories(),
    store.fetchDepartments()
  ])
  // Puis charger les campagnes
  await loadData()
})

// Watch profond pour recharger dès qu'un filtre change
watch(filters, loadData, { deep: true })
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
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

    <CampaignFilterBar v-model="filters" />
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Gestion des Campagnes</h1>
        <p class="text-sm text-slate-500">Pilotez les opérations agricoles et assignez vos équipes.</p>
      </div>

      <router-link to="/campaigns/create"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
        + Nouvelle Campagne
      </router-link>
    </div>

    <CampaignFilterBar v-model="filters" />

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

          <template v-else>
            <tr v-for="item in store.campaigns" :key="item._id" class="hover:bg-slate-50/80 transition-colors">
              <td class="p-4">
                <p class="font-semibold text-slate-900">{{ item.name }}</p>
                <p class="text-xs text-slate-500 mt-1">ID: {{ item._id?.slice(-8) }}</p>
              </td>
              <td class="p-4">
                <div class="space-y-1">
                  <span class="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                    {{ getDepartmentName(item) }}
                  </span>
                  <p class="text-xs text-slate-600">{{ getCategoryName(item) }}</p>
                </div>
              </td>
              <td class="p-4 text-sm">
                <div class="space-y-1">
                  <p class="text-slate-700">{{ formatDate(item.startDate) }}</p>
                  <p class="text-slate-500 text-xs">→ {{ formatDate(item.expectedEndDate) }}</p>
                </div>
              </td>
              <td class="p-4">
                <div class="flex -space-x-2">
                  <div v-if="hasRole(item, 'veterinaire')" title="Vétérinaire"
                    class="h-8 w-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-700 hover:scale-110 transition-transform">
                    V</div>
                  <div v-if="hasRole(item, 'comptable')" title="Comptable"
                    class="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700 hover:scale-110 transition-transform">
                    C</div>
                  <div v-if="hasRole(item, 'agent')" title="Agent"
                    class="h-8 w-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-700 hover:scale-110 transition-transform">
                    A</div>
                  <div v-if="hasRole(item, 'manager')" title="Manager"
                    class="h-8 w-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-700 hover:scale-110 transition-transform">
                    M</div>
                  <div v-if="!hasRole(item, 'veterinaire') && !hasRole(item, 'comptable') && !hasRole(item, 'agent') && !hasRole(item, 'manager')" 
                    class="text-xs text-slate-400 italic">Aucune</div>
                </div>
              </td>
              <td class="p-4 text-right">
                <router-link :to="`/campaigns/${item._id}`"
                  class="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                  Gérer
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </router-link>
              </td>
            </tr>
          </template>

          <tr v-if="!loading && store.campaigns.length === 0">
            <td colspan="5" class="p-12 text-center">
              <div class="inline-flex flex-col items-center justify-center">
                <svg class="w-16 h-16 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m7.5-2.25a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-slate-600 font-medium text-lg mb-1">Aucune campagne</p>
                <p class="text-slate-400 text-sm mb-4">Commencez par créer une nouvelle campagne pour démarrer.</p>
                <router-link to="/campaigns/create" class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
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
