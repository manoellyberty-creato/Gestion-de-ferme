import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'
import * as authService from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  function setToken(t) {
    token.value = t
    if (t) {
      localStorage.setItem('token', t)
      api.defaults.headers.common.Authorization = `Bearer ${t}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common.Authorization
    }
  }

  function setUser(u) {
    user.value = u
    if (u) localStorage.setItem('user', JSON.stringify(u))
    else localStorage.removeItem('user')
  }

  async function login(credentials) {
    const data = await authService.login(credentials)
    if (data?.token) {
      setToken(data.token)
      setUser(data.user ?? null)
    }
    return data
  }

  function logout() {
    setToken('')
    setUser(null)
  }

  // initialize axios header if token exists
  if (token.value) api.defaults.headers.common.Authorization = `Bearer ${token.value}`

  return { token, user, login, logout, setToken, setUser }
})
