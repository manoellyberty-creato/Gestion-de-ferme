<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { getAllDepartments } from '@/services/department.service.js'
import gsap from 'gsap'

const loading = ref(false)
const departments = ref([])
const search = ref('')

// Filtrage réactif des départements par nom
const filteredDepts = computed(() => {
  return departments.value.filter(d => 
    d.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

async function fetchDepts() {
  loading.value = true
  try {
    const data = await getAllDepartments()
    // Si votre API renvoie un objet avec une propriété data, utilisez data.data
    departments.value = Array.isArray(data) ? data : data.data || []
    
    await nextTick()
    
    // Animation d'entrée type "terminal" avec GSAP
    gsap.from(".row-item", {
      duration: 0.4,
      x: -10,
      opacity: 0,
      stagger: 0.05,
      ease: "power2.out"
    })
  } catch (err) {
    console.error("Erreur lors du chargement des départements:", err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDepts)
</script>

<template>
  <div class="min-h-screen bg-[#fafafa] text-[#1a2e26] p-8 font-mono">
    <div class="max-w-5xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-2 h-2 bg-[#2d5a45]"></div>
            <span class="text-[10px] uppercase tracking-tighter font-bold opacity-50">System_V3 / HR_Directory</span>
          </div>
          <h1 class="font-['Syne'] text-5xl font-extrabold tracking-tighter">Départements</h1>
        </div>

        <div class="relative w-full md:w-64">
          <input 
            v-model="search"
            type="text" 
            placeholder="FILTER_ID..."
            class="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-[#1a2e26] transition-colors placeholder:opacity-30 text-sm"
          />
          <svg class="absolute right-0 top-3 w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="3" />
          </svg>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 px-4 py-2 border-y border-gray-200 text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4">
        <div class="col-span-1">ID</div>
        <div class="col-span-4">Nom du Pôle</div>
        <div class="col-span-5">Description Data</div>
        <div class="col-span-2 text-right">Status</div>
      </div>

      <div v-if="!loading" class="space-y-1">
        <div 
          v-for="(dept, i) in filteredDepts" 
          :key="dept._id"
          class="row-item grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-100 transition-colors cursor-crosshair group"
        >
          <div class="col-span-1 text-[10px] font-bold text-gray-400">
            {{ String(i + 1).padStart(3, '0') }}
          </div>

          <div class="col-span-4">
            <span class="font-['Syne'] font-bold text-lg group-hover:text-[#2d5a45] transition-colors">
              {{ dept.name }}
            </span>
          </div>

          <div class="col-span-5 text-xs text-gray-600 leading-relaxed truncate group-hover:text-clip group-hover:whitespace-normal">
            {{ dept.description || '--- NULL_DATA ---' }}
          </div>

          <div class="col-span-2 flex justify-end items-center gap-3">
            <div class="h[1px] w-0 group-hover:w-8 bg-[#2d5a45] transition-all duration-300"></div>
            <svg class="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:text-[#2d5a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        <div v-if="filteredDepts.length === 0" class="py-20 text-center opacity-30 text-xs">
          NO_RESULTS_FOUND_FOR: "{{ search }}"
        </div>
      </div>

      <div v-else class="space-y-4">
        <div v-for="n in 5" :key="n" class="h-12 w-full bg-gray-100 animate-pulse border-b border-gray-200"></div>
      </div>

    </div>
  </div>
</template>