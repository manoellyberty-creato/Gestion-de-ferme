<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth.services.js';

const router = useRouter();

// États du formulaire
const form = ref({
  email: '',
  password: ''
});
const error = ref('');
const isLoading = ref(false);

const onLogin = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    const data = await authService.login(form.value);
    
    // 1. On stocke les infos
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // 2. On récupère le rôle pour l'aiguillage
    const role = data.user.role;

    // 3. Redirection selon le rôle
    switch (role) {
      case 'admin':
        router.push('/admin-dashboard');
        break;
      case 'manager':
        router.push('/manager-dashboard');
        break;
      case 'veterinaire':
        router.push('/veto-dashboard');
        break;
      case 'agent':
        router.push('/agent-dashboard');
        break;
      case 'comptable':
        router.push('/comptable-dashboard');
        break;
      default:
        router.push('/'); // Sécurité au cas où
    }

  } catch (err) {
    error.value = err.response?.data?.message || "Erreur de connexion";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-login bg-contain bg-center flex flex-col justify-center py-6 sm:py-12 relative">
    <div class="absolute inset-0 bg-black/40"></div>

    <div class="relative py-3 sm:max-w-xl sm:mx-auto z-10">
      <div
        class="absolute inset-0 bg-gradient-to-r from-green-600 to-lime-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-90">
      </div>
      
      <div class="relative px-4 py-10 bg-white/95 backdrop-blur-sm shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-black tracking-tighter text-green-900">FERME<span class="text-green-600">CONNECT</span></h1>
            <p class="text-gray-500 text-sm mt-1">Accès sécurisé à l'exploitation</p>
          </div>

          <div v-if="error" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-pulse">
            {{ error }}
          </div>

          <div class="divide-y divide-gray-200">
            <form @submit.prevent="onLogin" class="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
              <div class="relative">
                <input 
                  v-model="form.email"
                  autocomplete="off" id="email" name="email" type="email" required
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 transition-colors bg-transparent" 
                  placeholder="Email address" 
                />
                <label for="email" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-green-600 peer-focus:text-sm">
                  Adresse Email
                </label>
              </div>

              <div class="relative">
                <input 
                  v-model="form.password"
                  autocomplete="off" id="password" name="password" type="password" required
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 transition-colors bg-transparent" 
                  placeholder="Password" 
                />
                <label for="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-green-600 peer-focus:text-sm">
                  Mot de passe
                </label>
              </div>

              <div class="relative pt-4">
                <button 
                  :disabled="isLoading"
                  class="w-full bg-green-700 text-white rounded-lg px-4 py-2 font-bold hover:bg-green-800 transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  <span v-if="isLoading" class="animate-spin text-lg">↻</span>
                  {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
                </button>
              </div>
            </form>
          </div>

          <div class="w-full flex flex-col items-center gap-4">
            <div class="text-xs text-gray-400 uppercase tracking-widest">Ou</div>
            <button class="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none transition-colors">
              <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#34A853" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.94l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.bg-login {
  /* Vite résoudra le chemin automatiquement depuis src/assets */
  background-image: url('@/assets/images/agro.jpg');
}
</style>