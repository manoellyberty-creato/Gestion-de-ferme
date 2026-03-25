import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as agentService from '../services/agent.service'

export const useAgentDashboard = defineStore('agentDashboard', () => {
  // STATE
  const campaigns = ref([])
  const selectedCampaign = ref(null)
  const animals = ref([])
  const sickAnimals = ref([])
  const alerts = ref([])
  const tasks = ref([])
  const todayTasks = ref([])
  const overdueTasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // COMPUTED
  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed').length)
  const pendingTasks = computed(() => tasks.value.filter(task => task.status === 'pending').length)
  const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'in_progress').length)
  const taskCompletionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const sickAnimalsCount = computed(() => sickAnimals.value.length)
  const totalAnimalsCount = computed(() => animals.value.length)
  const alertsCount = computed(() => alerts.value.length)

  const campaignGoal = computed(() => selectedCampaign.value?.targetWeight || 0)
  const currentAverageWeight = computed(() => {
    if (animals.value.length === 0) return 0
    const sum = animals.value.reduce((acc, animal) => acc + (animal.weight || 0), 0)
    return (sum / animals.value.length).toFixed(2)
  })

  const campaignProgress = computed(() => {
    if (!campaignGoal.value || currentAverageWeight.value === 0) return 0
    return Math.min(100, Math.round((currentAverageWeight.value / campaignGoal.value) * 100))
  })

  const urgentAlerts = computed(() => alerts.value.filter(alert => alert.severity === 'critical'))

  // ACTIONS
  const fetchCampaigns = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await agentService.getCampaigns()
      campaigns.value = response.data?.data || []
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des campagnes'
      console.warn('AgentCampaigns:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAnimals = async (campaignId) => {
    try {
      const response = await agentService.getAnimals({ campaign: campaignId })
      animals.value = response.data?.data || []
    } catch (err) {
      console.warn('AgentAnimals:', err)
      animals.value = []
    }
  }

  const fetchSickAnimals = async (campaignId) => {
    try {
      const response = await agentService.getSickAnimals(campaignId)
      sickAnimals.value = response.data?.data || []
    } catch (err) {
      console.warn('AgentSickAnimals:', err)
      sickAnimals.value = []
    }
  }

  const fetchAlerts = async () => {
    try {
      const response = await agentService.getAlerts()
      alerts.value = response.data?.data || []
    } catch (err) {
      console.warn('AgentAlerts:', err)
      alerts.value = []
    }
  }

  const markAlertRead = async (alertId) => {
    try {
      await agentService.markAlertRead(alertId)
      await fetchAlerts()
    } catch (err) {
      console.warn('MarkAlertRead:', err)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await agentService.getAgentTasks()
      tasks.value = response.data?.data || []
    } catch (err) {
      console.warn('AgentTasks:', err)
      tasks.value = []
    }

    const today = new Date().toISOString().split('T')[0]

    todayTasks.value = tasks.value.filter(task => task.dueDate.startsWith(today))
    overdueTasks.value = tasks.value.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed')
  }

  const selectCampaign = async (campaignId) => {
    selectedCampaign.value = campaigns.value.find(c => c._id === campaignId)
    await Promise.all([
      fetchAnimals(campaignId),
      fetchSickAnimals(campaignId),
      fetchAlerts(),
      fetchTasks()
    ])
  }

  const toggleTaskStatus = (taskId) => {
    const task = tasks.value.find(t => t._id === taskId)
    if (!task) return

    if (task.status === 'completed') {
      task.status = 'pending'
    } else {
      task.status = 'completed'
    }

    // recompute date-based slices
    const today = new Date().toISOString().split('T')[0]
    todayTasks.value = tasks.value.filter(task => task.dueDate.startsWith(today))
    overdueTasks.value = tasks.value.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed')
  }

  const addTask = (taskData) => {
    const newTask = {
      _id: `task-${Date.now()}`,
      ...taskData,
      status: 'pending',
      progress: 0
    }
    tasks.value.unshift(newTask)
    fetchTasks()
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      await fetchCampaigns()
      await fetchTasks()
      await fetchAlerts()
      if (campaigns.value.length > 0) {
        await selectCampaign(campaigns.value[0]._id)
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement des données agent'
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    campaigns.value = []
    selectedCampaign.value = null
    animals.value = []
    sickAnimals.value = []
    alerts.value = []
    tasks.value = []
    todayTasks.value = []
    overdueTasks.value = []
    loading.value = false
    error.value = null
  }

  return {
    // STATE
    campaigns,
    selectedCampaign,
    animals,
    sickAnimals,
    alerts,
    tasks,
    todayTasks,
    overdueTasks,
    loading,
    error,
    // COMPUTED
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    taskCompletionRate,
    sickAnimalsCount,
    totalAnimalsCount,
    alertsCount,
    campaignGoal,
    currentAverageWeight,
    campaignProgress,
    urgentAlerts,
    // ACTIONS
    fetchCampaigns,
    fetchAnimals,
    fetchSickAnimals,
    fetchAlerts,
    markAlertRead,
    fetchTasks,
    selectCampaign,
    toggleTaskStatus,
    addTask,
    fetchAll,
    clear
  }
})
