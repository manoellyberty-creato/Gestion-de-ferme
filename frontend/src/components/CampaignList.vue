<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useCampaignStore } from '@/stores/campaign.store.js'

const store = useCampaignStore()
const loading = ref(true)

// État des filtres
const filters = ref({
  department: '',
  search: ''
})

// Fonction utilitaire pour vérifier un rôle dans le tableau assignedAgents
const hasRole = (item, roleName) => {
  return item.assignedAgents?.some(agent => agent.role === roleName)
}

// Computed pour le nom du statut (avec couleurs)
const getStatusBadge = (status) => {
  const statusMap = {
    'PREPARATION': { label: 'Préparation', class: 'bg-slate-100 text-slate-600' },
    'EN_COURS': { label: 'En cours', class: 'bg-blue-100 text-blue-600' },
    'TERMINEE': { label: 'Terminée', class: 'bg-emerald-100 text-emerald-600' },
    'SUSPENDUE': { label: 'Suspendue', class: 'bg-amber-100 text-amber-600' }
  }
  return statusMap[status] || { label: 'Inconnu', class: 'bg-slate-100 text-slate-600' }
}

// Computed pour obtenir le nom de la catégorie
const getCategoryName = (campaign) => {
  return 'Général'
}

// Computed pour obtenir le nom du département
const getDepartmentName = (campaign) => {
  if (!campaign) return 'N/A'
  // Le département est populé par le backend
  if (campaign.department?.name) return campaign.department.name
  if (campaign.department && typeof campaign.department === 'string') return 'Département'
  return 'Non défini'
}

// Computed pour compter les équipes assignées
const getTeamCount = (campaign) => {
  return campaign.assignedAgents?.length || 0
}

// Chargement des données via le Store
const loadData = async () => {
  loading.value = true
  try {
    await store.fetchCampaigns(filters.value)
  } catch (error) {
    console.error("Erreur chargement campagnes:", error)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

// Watch profond pour recharger dès qu'un filtre change
watch(filters, loadData, { deep: true })

// Computed pour la date formatée
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- En-tête -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Campagnes</h1>
        <p class="text-sm text-slate-500 mt-1">Organisez et pilotez vos opérations agricoles.</p>
      </div>

      <router-link to="/campaigns/create"
        class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Nouvelle Campagne
      </router-link>
    </div>

    <!-- Filtres -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-2">Recherche</label>
          <input v-model="filters.search" type="text" placeholder="Chercher une campagne..."
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-2">Département</label>
          <select v-model="filters.department" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les départements</option>
            <option v-for="dept in store.departments" :key="dept._id" :value="dept._id">{{ dept.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tableau des campagnes -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div v-if="loading" class="divide-y divide-slate-100">
        <!-- Skeleton loaders -->
        <div v-for="i in 3" :key="`skeleton-${i}`" class="p-4 animate-pulse">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <div class="h-5 bg-slate-100 rounded w-1/3 mb-2"></div>
              <div class="h-4 bg-slate-50 rounded w-1/4"></div>
            </div>
            <div class="h-6 bg-slate-100 rounded w-16"></div>
          </div>
        </div>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Campagne</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Localisation</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Dates</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Statut</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Équipe</th>
            <th class="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in store.campaigns" :key="item._id" class="hover:bg-slate-50/50 transition-colors">
            <!-- Colonne Campagne -->
            <td class="p-4">
              <div>
                <p class="font-semibold text-slate-900">{{ item.name }}</p>
                <p class="text-xs text-slate-500 mt-1">ID: {{ item._id?.slice(-8) }}</p>
              </div>
            </td>

            <!-- Colonne Localisation -->
            <td class="p-4">
              <div class="space-y-1">
                <span class="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                  {{ getDepartmentName(item) }}
                </span>
                <p class="text-xs text-slate-600 mt-1">{{ getCategoryName(item) }}</p>
              </div>
            </td>

            <!-- Colonne Dates -->
            <td class="p-4 text-sm">
              <div class="space-y-1">
                <p class="text-slate-700">{{ formatDate(item.startDate) }}</p>
                <p class="text-slate-500">→ {{ formatDate(item.expectedEndDate) }}</p>
              </div>
            </td>

            <!-- Colonne Statut -->
            <td class="p-4">
              <span :class="['text-xs font-bold px-2 py-1 rounded', getStatusBadge(item.status).class]">
                {{ getStatusBadge(item.status).label }}
              </span>
            </td>

            <!-- Colonne Équipe -->
            <td class="p-4">
              <div class="flex -space-x-2 items-center">
                <div v-if="getTeamCount(item) === 0" class="text-xs text-slate-400 italic">Aucune</div>
                <div v-else class="flex -space-x-2">
                  <div v-if="hasRole(item, 'veterinaire')" title="Vétérinaire"
                    class="h-8 w-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-700 hover:scale-110 transition-transform">
                    V
                  </div>
                  <div v-if="hasRole(item, 'comptable')" title="Comptable"
                    class="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700 hover:scale-110 transition-transform">
                    C
                  </div>
                  <div v-if="hasRole(item, 'agent')" title="Agent"
                    class="h-8 w-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-700 hover:scale-110 transition-transform">
                    A
                  </div>
                  <div v-if="hasRole(item, 'manager')" title="Manager"
                    class="h-8 w-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-700 hover:scale-110 transition-transform">
                    M
                  </div>
                </div>
              </div>
            </td>

            <!-- Colonne Actions -->
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

          <!-- Empty State -->
          <tr v-if="!loading && store.campaigns.length === 0">
            <td colspan="6" class="p-12 text-center">
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
</script>

<style scoped>
/* Smooth transitions */
tr {
  @apply transition-colors;
}
</style>
