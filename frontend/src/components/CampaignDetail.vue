<template>
    <div v-if="store.loading && !campaign" class="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p class="text-slate-500 animate-pulse font-medium">Chargement de la campagne...</p>
    </div>

    <div v-else-if="campaign" class="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
        
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <button @click="router.push('/campaigns')" class="group flex items-center text-slate-400 hover:text-blue-600 text-sm transition-all">
                        <span class="mr-1 group-hover:-translate-x-1 transition-transform">←</span> Retour
                    </button>
                    <span :class="statusClasses" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {{ statusLabel }}
                    </span>
                </div>
                <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ campaign.name }}</h1>
                <p class="text-sm text-slate-500 flex items-center gap-2">
                    <span class="font-semibold text-slate-700">{{ campaign.department?.name || 'Secteur non défini' }}</span>
                    <span class="text-slate-300">|</span>
                    <span>{{ campaign.categoryId?.name || 'Général' }}</span>
                </p>
            </div>

            <div class="flex gap-3">
                <button @click="router.push(`/campaigns/edit/${campaign._id}`)"
                    class="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all active:scale-95">
                    Modifier les infos
                </button>
                
                <button @click="handleStatusChange" :disabled="isUpdating"
                    class="relative overflow-hidden px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70">
                    <div class="flex items-center gap-2">
                        <span v-if="isUpdating" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                        {{ isUpdating ? 'Mise à jour...' : 'Changer le statut' }}
                    </div>
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div class="lg:col-span-2 space-y-6">
                <section class="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span class="w-1 h-6 bg-blue-600 rounded-full"></span>
                        Objectif de la campagne
                    </h3>
                    <div class="space-y-4">
                        <p class="text-slate-600 leading-relaxed">
                            {{ campaign.description || 'Aucune description détaillée.' }}
                        </p>
                        <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p class="text-sm font-semibold text-slate-700 mb-1">Indicateurs de succès :</p>
                            <p class="text-sm text-slate-500 italic">{{ campaign.goal || 'Non spécifié' }}</p>
                        </div>
                    </div>

                    <section class="bg-white p-4 border border-slate-200 rounded-xl">
                        <h4 class="text-sm font-bold text-slate-800 mb-2">Catégories dynamiques</h4>
                        <ul class="space-y-2">
                            <li v-for="cat in campaign.speciesCategories || []" :key="cat.name"
                                class="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                <div class="flex justify-between text-sm">
                                    <span class="font-semibold">{{ cat.name }}</span>
                                    <span class="text-slate-500">{{ cat.animalCount }} animaux</span>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section class="bg-white p-4 border border-slate-200 rounded-xl">
                        <h4 class="text-sm font-bold text-slate-800 mb-2">Animaux générés</h4>
                        <div v-if="campaignAnimals.length === 0" class="text-sm text-slate-500 italic">
                            Aucun animal généré.
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            <article v-for="animal in campaignAnimals" :key="animal._id" class="p-2 border border-slate-100 rounded-xl bg-slate-50 text-xs">
                                <p class="font-bold truncate">{{ animal.name || animal.species }}</p>
                                <p class="text-slate-500">{{ animal.species }}</p>
                                <p class="text-[10px] text-slate-400">Tag: {{ animal.tagNumber }}</p>
                                <img v-if="animal.qrCode" :src="animal.qrCode" alt="QR Code" class="w-full h-24 object-contain mt-2 rounded-md" />
                            </article>
                        </div>
                    </section>
                </section>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                        <div class="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl">📅</div>
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Date de début</p>
                            <p class="text-base font-bold text-slate-700">{{ formatDate(campaign.startDate) }}</p>
                        </div>
                    </div>
                    <div class="p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                        <div class="p-3 bg-rose-50 text-rose-600 rounded-lg text-xl">🏁</div>
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Échéance prévue</p>
                            <p class="text-base font-bold text-slate-700">{{ formatDate(campaign.expectedEndDate) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <aside class="space-y-6">
                <CampaignTeamManager 
            @open-assign="openAssignModal" 
            @remove-member="removeAssignedAgent"
        />

                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <h4 class="text-slate-800 text-xs font-black uppercase tracking-widest">Équipe du projet</h4>
                        <span class="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {{ assignedAgents.length }}
                        </span>
                    </div>
                    
                    <ul class="space-y-3">
                        <li v-for="member in assignedAgents" :key="member._id"
                            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                    {{ member.userId?.name?.charAt(0) || '?' }}
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm font-bold text-slate-700">{{ member.userId?.name || 'Inconnu' }}</span>
                                    <span class="text-[9px] uppercase font-black text-blue-500 tracking-tighter">{{ member.role }}</span>
                                </div>
                            </div>
                            <button @click="removeAssignedAgent(member)"
                                class="opacity-0 group-hover:opacity-100 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                Retirer
                            </button>
                        </li>
                        <li v-if="assignedAgents.length === 0" class="text-center py-6">
                            <p class="text-xs text-slate-400 italic">Aucun expert assigné pour le moment.</p>
                        </li>
                    </ul>
                </div>

                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-200">
                    <div class="flex justify-between items-start mb-6">
                        <h4 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Budget Alloué</h4>
                        <span class="bg-white/10 p-2 rounded-lg text-lg">💰</span>
                    </div>
                    <p class="text-4xl font-black mb-1 tracking-tight">{{ campaign.budget?.toLocaleString() }} <span class="text-xl font-normal opacity-60">€</span></p>
                    
                    <div class="mt-6 space-y-3 pt-4 border-t border-white/10">
                        <div class="flex justify-between text-xs font-bold">
                            <span class="text-slate-400 uppercase tracking-tighter">Utilisé</span>
                            <span class="text-blue-400">{{ campaign.totalCost || 0 }} €</span>
                        </div>
                        <div class="w-full bg-white/5 rounded-full h-1.5">
                            <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: budgetUsagePercent + '%' }"></div>
                        </div>
                        <div class="flex justify-between text-[10px] font-bold">
                            <span class="text-slate-400 uppercase tracking-tighter">Reste disponible</span>
                            <span :class="remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'">
                                {{ remainingBudget.toLocaleString() }} €
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <AssignCampaign 
            v-if="isAssignModalOpen" 
            :role="selectedRoleForAssign" 
            @close="isAssignModalOpen = false"
            @confirm="handleConfirmAssign"
        />
    </div>

    <div v-else class="text-center py-24 bg-white m-6 rounded-3xl border border-dashed border-slate-200">
        <div class="text-6xl mb-4">🔍</div>
        <h2 class="text-xl font-bold text-slate-800">Campagne introuvable</h2>
        <p class="text-slate-500 mt-2 mb-6">Elle a peut-être été supprimée ou l'ID est incorrect.</p>
        <button @click="router.push('/campaigns')" class="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold">
            Retour à la liste
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampaignStore } from '@/stores/campaign.store.js'

import CampaignTeamManager from '@/components/CampaignTeamManager.vue'
import AssignCampaign from '@/components/AssignCampaign.vue'

const route = useRoute()
const router = useRouter()
const store = useCampaignStore()

// ÉTATS LOCAUX
const isAssignModalOpen = ref(false)
const isUpdating = ref(false)
const selectedRoleForAssign = ref('')

// DATA COMPUTED
const campaign = computed(() => store.currentCampaign)
const assignedAgents = computed(() => campaign.value?.assignedAgents || [])
const campaignAnimals = computed(() => store.campaignAnimals || [])

const budgetUsagePercent = computed(() => {
    if (!campaign.value?.budget) return 0
    return Math.min(100, ((campaign.value.totalCost || 0) / campaign.value.budget) * 100)
})

const remainingBudget = computed(() => {
    return (campaign.value?.budget || 0) - (campaign.value?.totalCost || 0)
})

const statusClasses = computed(() => {
    const s = campaign.value?.status
    const statusLabels = {
        'preparation': 'bg-amber-100 text-amber-700 border border-amber-200',
        'active': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        'completed': 'bg-slate-100 text-slate-700 border border-slate-200'
    }
    return statusLabels[s] || 'bg-blue-100 text-blue-700 border border-blue-200'
})

const statusLabel = computed(() => {
    const s = campaign.value?.status
    const labels = {
        'preparation': 'Préparation',
        'active': 'En cours',
        'completed': 'Terminée'
    }
    return labels[s] || s
})

// MÉTHODES
const formatDate = (dateStr) => {
    if (!dateStr) return 'Non défini'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const openAssignModal = (role) => {
    selectedRoleForAssign.value = role
    isAssignModalOpen.value = true
}

const handleConfirmAssign = async (userId) => {
    try {
        const res = await store.assignMember({
            campaignId: campaign.value._id,
            userId: userId,
            role: selectedRoleForAssign.value
        })
        if (res.success) {
            isAssignModalOpen.value = false
        } else {
            alert(res.error || "Échec de l'assignation")
        }
    } catch (err) {
        console.error("Erreur lors de l'assignation:", err)
        alert("Erreur lors de l'assignation: " + err.message)
    }
}

const removeAssignedAgent = async (member) => {
    if (!confirm(`Retirer ${member.userId?.name} de ce projet ?`)) return
    const res = await store.unassignMember(campaign.value._id, member.userId._id)
    if (!res.success) alert(res.error)
}

const handleStatusChange = async () => {
    const statusCycle = {
        'preparation': 'active',
        'active': 'completed',
        'completed': 'preparation'
    }
    const statusLabels = {
        'preparation': 'Préparation',
        'active': 'En cours',
        'completed': 'Terminée'
    }
    const nextStatus = statusCycle[campaign.value.status] || 'preparation'
    const nextLabel = statusLabels[nextStatus] || 'Préparation'
    
    if (!confirm(`Passer la campagne en "${nextLabel}" ?`)) return

    isUpdating.value = true
    const res = await store.updateCampaign(campaign.value._id, { status: nextStatus })
    if (!res.success) alert(res.error || "Erreur lors du changement de statut")
    isUpdating.value = false
}

onMounted(async () => {
    const id = route.params.id
    if (id) {
      await store.fetchCampaignById(id)
      await store.fetchCampaignAnimals(id)
    }
})
</script>

<style scoped>
.animate-in {
    animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>