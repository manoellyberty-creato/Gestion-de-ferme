<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Configuration des menus avec SVGs (Path Heroicons style)
const menuItems = [
  { 
    name: 'DASHBOARD', 
    path: `/${user.role}-dashboard`, 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
          </svg>`
  },
  { 
    name: 'Utilisateurs', 
    path: '/users', 
    roles: ['admin'],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>`
  },
  { 
    name: 'Campagnes', 
    path: '/campaigns', 
    roles: ['admin', 'manager', "agent"],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.307a.515.515 0 0 0 .799-.037l7.039-10.389m-19.144 6.421 2.123 2.123c.42.42 1.07.54 1.62.383l4.74-1.353a1.5 1.5 0 0 1 1.611.411l3.478 3.479a1.5 1.5 0 0 0 2.145 0l5.959-5.959A1.5 1.5 0 0 0 21 14.542V19.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 19.5v-1.5a2.25 2.25 0 0 1 .75-1.687l.45-.421" />
          </svg>`
  },
  { 
    name: 'Département', 
    path: '/departement', 
    roles: ['admin', 'manager', 'agent'],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5-1.5-3-.545m-15 7.736 15-5.455V21" />
          </svg>`
  },
  { 
    name: 'Santé', 
    path: '/health', 
    roles: ['admin', 'manager', 'veterinaire'],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>`
  },
  { 
    name: 'Reports', 
    path: '/reports', 
    roles: ['admin', 'manager', 'comptable'],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>`
  }
];

// Filtrer selon le rôle
const filteredMenu = menuItems.filter(item => !item.roles || item.roles.includes(user.role));
</script>

<template>
  <aside class="w-64 bg-green-900 text-white flex flex-col h-screen sticky top-0 shadow-xl">
    <div class="p-6 border-b border-green-800">
      <h1 class="text-xl font-black tracking-widest uppercase">Ferme<span class="text-green-400">CONNECT</span></h1>
    </div>
    
    <nav class="flex-1 mt-6 px-4 space-y-1">
      <router-link 
        v-for="item in filteredMenu" 
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-800 transition-all duration-200 group"
        active-class="bg-green-700 text-white shadow-inner"
      >
        <div v-html="item.icon" class="text-green-400 group-hover:scale-110 transition-transform"></div>
        <span class="text-sm font-medium">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="p-4 bg-green-950/50 m-4 rounded-xl text-center">
      <p class="text-[10px] uppercase tracking-widest text-green-500 font-bold">Session</p>
      <p class="text-xs font-medium truncate">{{ user.name }}</p>
    </div>
  </aside>
</template>