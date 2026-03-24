<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div class="text-center">
      <div class="flex justify-center mb-6">
        <div class="p-6 bg-green-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <h1 class="text-9xl font-black text-green-900/10 absolute inset-0 flex items-center justify-center -z-10 select-none">
        404
      </h1>

      <h2 class="text-3xl font-bold text-gray-800 mb-2">Page introuvable</h2>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        Désolé, la parcelle que vous cherchez n'existe pas ou a été déplacée.
      </p>

      <router-link 
        to="/" 
        class="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-green-900/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l1.293 1.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Retour au tableau de bord
      </router-link>
    </div>
  </div>
</template>