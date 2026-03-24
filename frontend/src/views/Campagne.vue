<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const campaigns = ref([])
const loading = ref(false)
const error = ref('')

async function fetchCampaigns() {
	loading.value = true
	try {
		const res = await api.get('/campaign')
		campaigns.value = res.data
	} catch (err) {
		error.value = err?.response?.data?.message || err.message
	} finally {
		loading.value = false
	}
}

onMounted(fetchCampaigns)
</script>

<template>
	<div>
		<h2 class="text-xl mb-2">Campagnes</h2>
		<div v-if="error" class="text-red-600">{{ error }}</div>
		<div v-if="loading">Chargement...</div>
		<ul v-else>
			<li v-for="c in campaigns" :key="c._id" class="border p-2 mb-2">
				<div><strong>Nom:</strong> {{ c.name || c.title || c._id }}</div>
				<div><strong>Statut:</strong> {{ c.status || '-' }}</div>
			</li>
		</ul>
	</div>
</template>

<style scoped></style>