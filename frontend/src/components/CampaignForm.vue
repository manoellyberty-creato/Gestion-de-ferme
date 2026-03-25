<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign.store.js'

const router = useRouter()
const store = useCampaignStore()

const form = reactive({
  name: '',
  categoryId: '',
  department: '',
  startDate: '',
  expectedEndDate: '',
  goal: '',
  budget: '',
  notes: '',
  numberOfSpecies: 1,
  speciesCategories: [
    {
      name: '',
      animalCount: ''
    }
  ],
  goalMetrics: {
    targetWeight: '',
    targetAge: '',
    targetPrice: '',
    targetVolume: '',
    qualityStandards: ''
  }
})

const errors = reactive({})
const isSubmitting = ref(false)
const feedback = ref('')
const goals = ['PRODUCTION', 'REPRODUCTION', 'TRANSFORMATION', 'MAINTENANCE']
const loadingData = ref(true)

const syncSpeciesCategories = (count) => {
  const clamped = Math.max(1, Number(count) || 1)
  form.numberOfSpecies = clamped

  while (form.speciesCategories.length < clamped) {
    form.speciesCategories.push({ name: '', animalCount: '' })
  }

  while (form.speciesCategories.length > clamped) {
    form.speciesCategories.pop()
  }
}

const addSpeciesCategory = () => {
  form.speciesCategories.push({ name: '', animalCount: '' })
  form.numberOfSpecies = form.speciesCategories.length
}

const removeSpeciesCategory = (index) => {
  if (form.speciesCategories.length <= 1) return
  form.speciesCategories.splice(index, 1)
  form.numberOfSpecies = form.speciesCategories.length
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  feedback.value = ''
}

const validate = () => {
  clearErrors()

  if (!form.name.trim()) errors.name = 'Le nom est requis.'
  if (!form.categoryId.trim()) errors.categoryId = 'L’id de la catégorie est requis.'
  if (!form.department.trim()) errors.department = 'L’id du département est requis.'
  if (!form.startDate) errors.startDate = 'Date de début requise.'
  if (!form.expectedEndDate) errors.expectedEndDate = 'Date de fin attendue requise.'
  if (form.startDate && form.expectedEndDate && form.startDate >= form.expectedEndDate) {
    errors.expectedEndDate = 'La date de fin doit être après la date de début.'
  }
  if (!form.goal) errors.goal = 'Objectif requis.'
  if (!form.budget || Number(form.budget) <= 0) errors.budget = 'Budget cohérent requis (> 0).'

  if (!Array.isArray(form.speciesCategories) || form.speciesCategories.length === 0) {
    errors.speciesCategories = 'Au moins une catégorie est requise.'
  } else {
    form.speciesCategories.forEach((cat, idx) => {
      if (!cat.name || !cat.name.trim()) {
        errors[`speciesCategories.${idx}.name`] = 'Nom requis.'
      }
      if (!cat.animalCount || Number(cat.animalCount) <= 0) {
        errors[`speciesCategories.${idx}.animalCount`] = 'Nombre d\'animaux requis (> 0).'
      }
    })
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    const userId = localStorage.getItem('userId') || ''
    if (!userId) {
      feedback.value = "Impossible de créer : utilisateur non identifié."
      return
    }

    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      department: form.department,
      startDate: form.startDate,
      expectedEndDate: form.expectedEndDate,
      goal: form.goal,
      budget: Number(form.budget),
      notes: form.notes,
      speciesCategories: form.speciesCategories.map(sc => ({
        name: sc.name.trim(),
        animalCount: Number(sc.animalCount)
      })),
      goalMetrics: {
        targetWeight: form.goalMetrics.targetWeight ? Number(form.goalMetrics.targetWeight) : undefined,
        targetAge: form.goalMetrics.targetAge ? Number(form.goalMetrics.targetAge) : undefined,
        targetPrice: form.goalMetrics.targetPrice ? Number(form.goalMetrics.targetPrice) : undefined,
        targetVolume: form.goalMetrics.targetVolume ? Number(form.goalMetrics.targetVolume) : undefined,
        qualityStandards: form.goalMetrics.qualityStandards
      }
    }

    const result = await store.createCampaign(payload, userId)
    if (!result.success) {
      feedback.value = result.error || 'Erreur création campagne.'
      return
    }

    router.push({ name: 'Campaigns' })
  } catch (e) {
    feedback.value = e.message || 'Erreur inattendue'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      store.fetchCategories(),
      store.fetchDepartments()
    ])
  } catch (err) {
    console.error("Erreur chargement données:", err)
  } finally {
    loadingData.value = false
  }
})
</script>


<template>
  <div class="max-w-3xl mx-auto p-6 bg-[#f8f9fa] rounded-2xl border border-slate-200 shadow-sm">
    <h1 class="text-2xl font-bold mb-5 text-slate-900">Nouvelle Campagne</h1>

    <div v-if="feedback" class="mb-4 p-3 rounded" :class="feedback.includes('Erreur') ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'">
      {{ feedback }}
    </div>

    <div class="grid gap-4">
      <label class="text-sm text-slate-700">
        Nom
        <input v-model="form.name" type="text" class="mt-1 w-full rounded-lg border border-slate-300 p-2" placeholder="Nom de la campagne" />
        <p v-if="errors.name" class="text-rose-600 text-xs mt-1">{{ errors.name }}</p>
      </label>

      <label class="text-sm text-slate-700">
        Catégorie
        <select v-model="form.categoryId" :disabled="loadingData" class="mt-1 w-full rounded-lg border border-slate-300 p-2 disabled:bg-slate-100">
          <option value="">{{ loadingData ? 'Chargement...' : 'Sélectionner une catégorie' }}</option>
          <option v-for="cat in store.categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
        </select>
        <p v-if="errors.categoryId" class="text-rose-600 text-xs mt-1">{{ errors.categoryId }}</p>
      </label>

      <label class="text-sm text-slate-700">
        Département
        <select v-model="form.department" :disabled="loadingData" class="mt-1 w-full rounded-lg border border-slate-300 p-2 disabled:bg-slate-100">
          <option value="">{{ loadingData ? 'Chargement...' : 'Sélectionner un département' }}</option>
          <option v-for="d in store.departments" :key="d._id" :value="d._id">{{ d.name }}</option>
        </select>
        <p v-if="errors.department" class="text-rose-600 text-xs mt-1">{{ errors.department }}</p>
      </label>

      <label class="text-sm text-slate-700">
        Nombre de catégories souhaitées
        <input v-model.number="form.numberOfSpecies" @change="syncSpeciesCategories(form.numberOfSpecies)" type="number" min="1" class="mt-1 w-full rounded-lg border border-slate-300 p-2" />
        <p v-if="errors.speciesCategories" class="text-rose-600 text-xs mt-1">{{ errors.speciesCategories }}</p>
      </label>

      <div class="grid grid-cols-1 gap-4">
        <div v-for="(item, index) in form.speciesCategories" :key="index" class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div class="flex items-center justify-between gap-3 mb-3">
            <h4 class="text-sm font-bold text-slate-800">Catégorie {{ index + 1 }}</h4>
            <button type="button" @click="removeSpeciesCategory(index)" class="text-rose-600 text-xs font-bold hover:underline">Supprimer</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-slate-600">Nom de la catégorie</label>
              <input v-model="item.name" type="text" placeholder="Ex: Volaille" class="mt-1 w-full rounded-lg border border-slate-300 p-2" />
              <p v-if="errors[`speciesCategories.${index}.name`]" class="text-rose-600 text-[11px] mt-1">{{ errors[`speciesCategories.${index}.name`] }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-600">Nombre d'animaux</label>
              <input v-model.number="item.animalCount" type="number" min="1" placeholder="10" class="mt-1 w-full rounded-lg border border-slate-300 p-2" />
              <p v-if="errors[`speciesCategories.${index}.animalCount`]" class="text-rose-600 text-[11px] mt-1">{{ errors[`speciesCategories.${index}.animalCount`] }}</p>
            </div>
          </div>
        </div>
      </div>

      <button type="button" @click="addSpeciesCategory" class="w-full px-3 py-2 mt-2 text-sm font-semibold rounded-lg bg-[hsl(14,86%,42%)] text-white hover:bg-[hsl(14,86%,42%,0.85)]">Ajouter une catégorie</button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="text-sm text-slate-700">
          Début
          <input v-model="form.startDate" type="date" class="mt-1 w-full rounded-lg border border-slate-300 p-2" />
          <p v-if="errors.startDate" class="text-rose-600 text-xs mt-1">{{ errors.startDate }}</p>
        </label>
        <label class="text-sm text-slate-700">
          Fin prévue
          <input v-model="form.expectedEndDate" type="date" class="mt-1 w-full rounded-lg border border-slate-300 p-2" />
          <p v-if="errors.expectedEndDate" class="text-rose-600 text-xs mt-1">{{ errors.expectedEndDate }}</p>
        </label>
      </div>

      <label class="text-sm text-slate-700">
        Objectif
        <select v-model="form.goal" class="mt-1 w-full rounded-lg border border-slate-300 p-2">
          <option value="">Sélectionner un objectif</option>
          <option v-for="g in goals" :key="g" :value="g">{{ g }}</option>
        </select>
        <p v-if="errors.goal" class="text-rose-600 text-xs mt-1">{{ errors.goal }}</p>
      </label>

      <label class="text-sm text-slate-700">
        Budget (€)
        <input v-model="form.budget" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border border-slate-300 p-2" />
        <p v-if="errors.budget" class="text-rose-600 text-xs mt-1">{{ errors.budget }}</p>
      </label>

      <label class="text-sm text-slate-700">
        Note (optionnelle)
        <textarea v-model="form.notes" rows="3" class="mt-1 w-full rounded-lg border border-slate-300 p-2"></textarea>
      </label>

      <div class="p-4 rounded-lg border border-slate-200 bg-white">
        <h2 class="font-semibold text-slate-700 text-sm mb-2">Indicateurs</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input v-model="form.goalMetrics.targetWeight" type="number" placeholder="Poids cible" class="w-full rounded-lg border border-slate-300 p-2" />
          <input v-model="form.goalMetrics.targetAge" type="number" placeholder="Âge cible" class="w-full rounded-lg border border-slate-300 p-2" />
          <input v-model="form.goalMetrics.targetPrice" type="number" placeholder="Prix cible" class="w-full rounded-lg border border-slate-300 p-2" />
          <input v-model="form.goalMetrics.targetVolume" type="number" placeholder="Volume cible" class="w-full rounded-lg border border-slate-300 p-2" />
          <input v-model="form.goalMetrics.qualityStandards" type="text" placeholder="Normes qualité" class="sm:col-span-2 w-full rounded-lg border border-slate-300 p-2" />
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button type="button" @click="router.push({ name: 'Campaigns' })" class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100">Annuler</button>
        <button type="button" @click="handleSubmit" :disabled="isSubmitting" class="px-5 py-2.5 rounded-lg bg-[hsl(14,86%,42%)] text-white hover:bg-[#cc5c39] disabled:opacity-50">{{ isSubmitting ? 'Enregistrement...' : 'Créer la campagne' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>