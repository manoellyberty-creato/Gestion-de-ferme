<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button @click="router.back()" class="group flex items-center text-slate-400 hover:text-blue-600 text-sm font-semibold transition-all mb-4">
          <span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Retour
        </button>
        <h1 class="text-4xl font-extrabold text-slate-800 tracking-tight">Modifier la campagne</h1>
        <p class="text-slate-500 mt-2">Mettez à jour les informations de la campagne</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p class="text-slate-500 font-medium">Chargement de la campagne...</p>
      </div>

      <!-- Form -->
      <div v-else class="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        
        <!-- Nom -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Nom de la campagne</label>
          <input
            v-model="form.name"
            @blur="clearErrorFor('name')"
            type="text"
            placeholder="Ex: Vaccination printemps 2026"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span class="text-lg">⚠️</span> {{ errors.name }}
          </p>
        </div>

        <!-- Catégorie -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
          <select
            v-model="form.categoryId"
            @change="clearErrorFor('categoryId')"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="errors.categoryId ? 'border-red-500 bg-red-50' : 'border-slate-200'"
          >
            <option value="">-- Sélectionner --</option>
            <option v-for="cat in store.categories" :key="cat._id" :value="cat._id">
              {{ cat.name }}
            </option>
          </select>
          <p v-if="errors.categoryId" class="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span class="text-lg">⚠️</span> {{ errors.categoryId }}
          </p>
        </div>

        <!-- Département -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Département</label>
          <select
            v-model="form.department"
            @change="clearErrorFor('department')"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="errors.department ? 'border-red-500 bg-red-50' : 'border-slate-200'"
          >
            <option value="">-- Sélectionner --</option>
            <option v-for="dept in store.departments" :key="dept._id" :value="dept._id">
              {{ dept.name }}
            </option>
          </select>
          <p v-if="errors.department" class="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span class="text-lg">⚠️</span> {{ errors.department }}
          </p>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Date de début</label>
            <input
              v-model="form.startDate"
              type="date"
              @blur="clearErrorFor('startDate')"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p v-if="errors.startDate" class="text-red-500 text-sm mt-1">{{ errors.startDate }}</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Date de fin attendue</label>
            <input
              v-model="form.expectedEndDate"
              type="date"
              @blur="clearErrorFor('expectedEndDate')"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              :class="errors.expectedEndDate ? 'border-red-500 bg-red-50' : 'border-slate-200'"
            />
            <p v-if="errors.expectedEndDate" class="text-red-500 text-sm mt-1">{{ errors.expectedEndDate }}</p>
          </div>
        </div>

        <!-- Budget -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Budget (€)</label>
          <input
            v-model.number="form.budget"
            type="number"
            min="0"
            placeholder="0"
            @blur="clearErrorFor('budget')"
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <p v-if="errors.budget" class="text-red-500 text-sm mt-1">{{ errors.budget }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Décrivez l'objectif et le contexte de la campagne..."
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Objectif -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Objectif de la campagne</label>
          <select
            v-model="form.goal"
            @change="clearErrorFor('goal')"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="errors.goal ? 'border-red-500 bg-red-50' : 'border-slate-200'"
          >
            <option value="">-- Sélectionner --</option>
            <option v-for="g in goals" :key="g" :value="g">
              {{ formatGoalLabel(g) }}
            </option>
          </select>
          <p v-if="errors.goal" class="text-red-500 text-sm mt-1">{{ errors.goal }}</p>
        </div>

        <!-- Statut -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Statut</label>
          <select
            v-model="form.status"
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="preparation">Préparation</option>
            <option value="active">En cours</option>
            <option value="completed">Terminée</option>
          </select>
        </div>

        <!-- Feedback Message -->
        <div v-if="feedback" :class="[
          'p-4 rounded-xl text-sm font-semibold flex items-center gap-2',
          feedback.includes('succès') || feedback.includes('Succès')
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-red-50 text-red-700'
        ]">
          <span>{{ feedback.includes('succès') || feedback.includes('Succès') ? '✅' : '❌' }}</span>
          {{ feedback }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            @click="router.back()"
            class="flex-1 px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
          >
            Annuler
          </button>
          <button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="flex-1 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign.store.js'

const router = useRouter()
const route = useRoute()
const store = useCampaignStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const feedback = ref('')
const goals = ['production', 'reproduction', 'transformation', 'maintenance']

const form = reactive({
  name: '',
  categoryId: '',
  department: '',
  startDate: '',
  expectedEndDate: '',
  budget: '',
  description: '',
  goal: '',
  status: 'preparation'
})

const errors = reactive({})

const clearErrorFor = (field) => {
  if (errors[field]) delete errors[field]
}

const formatGoalLabel = (goal) => {
  const labels = {
    'production': 'Production',
    'reproduction': 'Reproduction',
    'transformation': 'Transformation',
    'maintenance': 'Maintenance'
  }
  return labels[goal] || goal
}

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.name.trim()) errors.name = 'Le nom est requis.'
  if (!form.categoryId) errors.categoryId = 'La catégorie est requise.'
  if (!form.department) errors.department = 'Le département est requis.'
  if (!form.startDate) errors.startDate = 'Date de début requise.'
  if (!form.expectedEndDate) errors.expectedEndDate = 'Date de fin requise.'
  if (form.startDate && form.expectedEndDate && form.startDate >= form.expectedEndDate) {
    errors.expectedEndDate = 'La date de fin doit être après la date de début.'
  }
  if (!form.goal) errors.goal = 'L\'objectif est requis.'
  if (form.budget && isNaN(form.budget)) errors.budget = 'Le budget doit être un nombre.'

  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) {
    feedback.value = 'Veuillez corriger les erreurs'
    return
  }

  isSubmitting.value = true
  feedback.value = ''

  try {
    const res = await store.updateCampaign(route.params.id, {
      name: form.name,
      categoryId: form.categoryId,
      department: form.department,
      startDate: form.startDate,
      expectedEndDate: form.expectedEndDate,
      budget: parseFloat(form.budget) || 0,
      description: form.description,
      goal: form.goal,
      status: form.status
    })

    if (res.success) {
      feedback.value = 'Succès! Campagne mise à jour.'
      setTimeout(() => {
        router.push(`/campaigns/${route.params.id}`)
      }, 1500)
    } else {
      feedback.value = res.error || 'Erreur lors de la mise à jour'
    }
  } catch (err) {
    feedback.value = 'Erreur: ' + err.message
  } finally {
    isSubmitting.value = false
  }
}

const formatDateForInput = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

onMounted(async () => {
  try {
    // Charger les catégories et départements
    await store.fetchCategories()
    await store.fetchDepartments()

    // Charger la campagne actuelle
    await store.fetchCampaignById(route.params.id)
    const campaign = store.currentCampaign

    if (campaign) {
      form.name = campaign.name
      form.categoryId = campaign.categoryId?._id || campaign.categoryId
      form.department = campaign.department?._id || campaign.department
      form.startDate = formatDateForInput(campaign.startDate)
      form.expectedEndDate = formatDateForInput(campaign.expectedEndDate)
      form.budget = campaign.budget || ''
      form.description = campaign.description || ''
      form.goal = campaign.goal || ''
      form.status = campaign.status || 'preparation'
    }
  } catch (err) {
    console.error('Erreur:', err)
    feedback.value = 'Impossible de charger la campagne'
  } finally {
    isLoading.value = false
  }
})
</script>
