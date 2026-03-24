<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const animals = ref([])
const loading = ref(false)
const error = ref('')

async function fetchAnimals() {
	loading.value = true
	error.value = ''
	try {
		const res = await api.get('/animals')
		animals.value = res.data
	} catch (err) {
		error.value = err?.response?.data?.message || err.message
	} finally {
		loading.value = false
	}
}

onMounted(fetchAnimals)
</script>


<template>
	<div>
		<h2 class="text-xl mb-2">Animaux</h2>
		<div v-if="error" class="text-red-600">{{ error }}</div>
		<div v-if="loading">Chargement...</div>
		<ul v-else>
			<li v-for="a in animals" :key="a._id" class="border p-2 mb-2">
				<div><strong>ID:</strong> {{ a._id }}</div>
				<div><strong>Tag:</strong> {{ a.tagNumber || '-' }}</div>
				<div><strong>Campagne:</strong> {{ a.campaignId || '-' }}</div>
			</li>
		</ul>
	</div>
</template>

<style scoped></style>