import { defineStore } from 'pinia'
import api from '@/services/api'

const API_BASE = '/campaigns'
const CATEGORIES_API = '/categories'
const DEPARTMENTS_API = '/departments'

export const useCampaignStore = defineStore('campaign', {
  state: () => ({
    campaigns: [],
    categories: [],
    departments: [],
    currentCampaign: null,
    campaignAnimals: [],
    loading: false,
    loadingCategories: false,
    loadingDepartments: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10
    }
  }),

  actions: {
    // CATÉGORIES
    async fetchCategories(department = null) {
      this.loadingCategories = true
      try {
        const params = department ? { department } : {}
        const res = await api.get(CATEGORIES_API, { params })
        this.categories = res.data
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || "Erreur lors du chargement des catégories"
        return []
      } finally {
        this.loadingCategories = false
      }
    },

    // DÉPARTEMENTS
    async fetchDepartments() {
      this.loadingDepartments = true
      try {
        const res = await api.get(DEPARTMENTS_API)
        this.departments = res.data
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || "Erreur lors du chargement des départements"
        return []
      } finally {
        this.loadingDepartments = false
      }
    },

    // 1. RÉCUPÉRATION GLOBALE (avec pagination)
    async fetchCampaigns(filters = {}, page = 1) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        params.set('page', page)
        if (filters.search) params.set('search', filters.search)
        if (filters.category) params.set('category', filters.category)
        if (filters.department) params.set('department', filters.department)

        const res = await api.get(`${API_BASE}?${params.toString()}`)
        this.campaigns = res.data
        this.pagination.page = page
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || "Erreur lors du chargement des campagnes"
        return []
      } finally {
        this.loading = false
      }
    },

    // 2. RÉCUPÉRATION D'UNE CAMPAGNE PRÉCISE
    async fetchCampaignById(id) {
      this.loading = true
      try {
        const res = await api.get(`${API_BASE}/${id}`)
        this.currentCampaign = res.data
        return { success: true }
      } catch (err) {
        this.error = "Campagne introuvable"
        return { success: false }
      } finally {
        this.loading = false
      }
    },

    // 3. CRÉATION (Lie le controller createCampaignController)
    async createCampaign(data, userId) {
      try {
        const res = await api.post(`${API_BASE}/create/${userId}`, data)
        this.campaigns.unshift(res.data)
        return { success: true, data: res.data }
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Échec création campagne" }
      }
    },

    // 4. MODIFICATION (updateCampaignController)
    async updateCampaign(id, data) {
      try {
        const res = await api.patch(`${API_BASE}/update/${id}`, data)
        this.currentCampaign = res.data
        return { success: true }
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Échec mise à jour campagne" }
      }
    },

    // 5. SUPPRESSION (deleteCampaignController)
    async deleteCampaign(id) {
      try {
        await api.delete(`${API_BASE}/delete/${id}`)
        this.campaigns = this.campaigns.filter(c => c._id !== id)
        return { success: true }
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Échec suppression campagne" }
      }
    },

    async fetchCampaignAnimals(campaignId) {
      try {
        const res = await api.get(`/animals?campaignId=${campaignId}`)
        this.campaignAnimals = res.data.data || res.data
        return { success: true, data: this.campaignAnimals }
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Erreur chargement animaux" }
      }
    },
    // 6. ASSIGNATIONS (Gère dynamiquement les 4 rôles de ton backend)
    async assignMember({ campaignId, userId, role }) {
      try {
        let slug = ''
        // On calque exactement tes routes Express
        switch (role) {
          case 'agent': slug = 'assignAgent'; break
          case 'manager': slug = 'assignManager'; break
          case 'veterinaire': slug = 'assignVeterinarian'; break
          case 'comptable': slug = 'assignComptable'; break
          default: throw new Error("Rôle non supporté")
        }

        const res = await api.put(`${API_BASE}/${slug}/${campaignId}/${userId}`)
        
        // ✅ Mise à jour réactive complète : backend retourne la campagne populée
        if (this.currentCampaign && this.currentCampaign._id === campaignId) {
          // Remplacer la campagne entière pour garantir la réactivité
          this.currentCampaign = res.data
        }
        return { success: true, data: res.data }
      } catch (err) {
        return { success: false, error: err.response?.data?.message }
      }
    },

    // 7. DÉSASSIGNATION (unassignAgentFromCampaignController)
    async unassignMember(campaignId, userId) {
      try {
        const res = await api.delete(`${API_BASE}/unassign/${campaignId}/${userId}`)
        
        // ✅ Remplacer la campagne entière pour garantir la réactivité
        // Le backend retourne maintenant la campagne complètement populée
        if (this.currentCampaign && this.currentCampaign._id === campaignId) {
          this.currentCampaign = res.data
        }
        return { success: true }
      } catch (err) {
        return { success: false, error: err.response?.data?.message }
      }
    }
  }
})