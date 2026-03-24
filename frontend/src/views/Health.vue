<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const products = ref([])
const loading = ref(false)
const error = ref('')

async function fetchProducts() {
	loading.value = true
	try {
		const res = await api.get('/health/products')
		products.value = res.data
	} catch (err) {
		error.value = err?.response?.data?.message || err.message
	} finally {
		loading.value = false
	}
}

onMounted(fetchProducts)
</script>

<template>
	<div>
		<h2 class="text-xl mb-2">Santé - Produits</h2>
		<div v-if="error" class="text-red-600">{{ error }}</div>
		<div v-if="loading">Chargement...</div>
		<ul v-else>
			<li v-for="p in products" :key="p._id" class="border p-2 mb-2">
				<div><strong>Nom:</strong> {{ p.name || p._id }}</div>
				<div><strong>Stock:</strong> {{ p.stock ?? '-' }}</div>
			</li>
		</ul>
	</div>
</template>

<style scoped></style>