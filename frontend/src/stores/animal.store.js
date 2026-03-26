import { defineStore } from 'pinia'
import {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  generateAnimalQRCode,
  scanAnimal,
  getAnimalHistory,
  getCampaignAnimalStats
} from '@/services/animals.service'

export const useAnimalStore = defineStore('animal', {
  state: () => ({
    animals: [],
    currentAnimal: null,
    campaignAnimals: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async fetchAnimals(filters = {}) {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...filters
        }
        const res = await getAllAnimals(params)
        this.animals = res.data.data || res.data
        this.pagination.total = res.data.total || this.animals.length
        return { success: true, data: this.animals }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des animaux'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchAnimalById(id) {
      this.loading = true
      try {
        const res = await getAnimalById(id)
        this.currentAnimal = res.data.data || res.data
        return { success: true, data: this.currentAnimal }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement de l\'animal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createNewAnimal(animalData) {
      this.loading = true
      try {
        const res = await createAnimal(animalData)
        const newAnimal = res.data.data || res.data
        this.animals.unshift(newAnimal)
        this.campaignAnimals.unshift(newAnimal)
        return { success: true, data: newAnimal }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors de la création de l\'animal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateExistingAnimal(id, animalData) {
      this.loading = true
      try {
        const res = await updateAnimal(id, animalData)
        const updatedAnimal = res.data.data || res.data

        // Update in animals array
        const index = this.animals.findIndex(a => a._id === id)
        if (index !== -1) {
          this.animals[index] = updatedAnimal
        }

        // Update in campaignAnimals array
        const campaignIndex = this.campaignAnimals.findIndex(a => a._id === id)
        if (campaignIndex !== -1) {
          this.campaignAnimals[campaignIndex] = updatedAnimal
        }

        if (this.currentAnimal && this.currentAnimal._id === id) {
          this.currentAnimal = updatedAnimal
        }

        return { success: true, data: updatedAnimal }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors de la mise à jour de l\'animal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteExistingAnimal(id) {
      this.loading = true
      try {
        await deleteAnimal(id)

        // Remove from animals array
        this.animals = this.animals.filter(a => a._id !== id)

        // Remove from campaignAnimals array
        this.campaignAnimals = this.campaignAnimals.filter(a => a._id !== id)

        if (this.currentAnimal && this.currentAnimal._id === id) {
          this.currentAnimal = null
        }

        return { success: true }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors de la suppression de l\'animal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchCampaignAnimals(campaignId) {
      this.loading = true
      try {
        const res = await getAllAnimals({ campaignId })
        this.campaignAnimals = res.data.data || res.data
        return { success: true, data: this.campaignAnimals }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des animaux de la campagne'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async generateQRCode(animalId) {
      try {
        const res = await generateAnimalQRCode(animalId)
        return { success: true, data: res.data }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors de la génération du QR code'
        return { success: false, error: this.error }
      }
    },

    async scanAnimalByTag(tagNumber) {
      try {
        const res = await scanAnimal(tagNumber)
        return { success: true, data: res.data.data || res.data }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du scan de l\'animal'
        return { success: false, error: this.error }
      }
    },

    async getAnimalStats(campaignId) {
      try {
        const res = await getCampaignAnimalStats(campaignId)
        return { success: true, data: res.data.data || res.data }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors du chargement des statistiques'
        return { success: false, error: this.error }
      }
    },

    clearError() {
      this.error = null
    },

    setPagination(page, limit) {
      this.pagination.page = page
      this.pagination.limit = limit
    }
  }
})