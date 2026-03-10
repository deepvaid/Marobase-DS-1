import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnalyticsStore = defineStore('analytics', () => {
  const accountMetrics = ref({
    deliverability: 99.4,
    monthlyEmailsSent: 1450200,
    monthlyLimit: 2000000,
    activeContacts: 450000,
    revenueAttributed: 1250400.50,
    totalRevenue: 1250400,
    activeSubscribers: 450000,
    avgOpenRate: 24.5,
    monthlySends: 1450000
  })

  // Mock robust chart data series
  const chartData = ref([
    { date: 'Jan', gets: 12000, revenue: 3000, orders: 120, subscribers: 450, sends: 12000 },
    { date: 'Feb', gets: 19000, revenue: 4500, orders: 180, subscribers: 600, sends: 19000 },
    { date: 'Mar', gets: 15000, revenue: 3200, orders: 130, subscribers: 480, sends: 15000 },
    { date: 'Apr', gets: 22000, revenue: 5000, orders: 200, subscribers: 700, sends: 22000 },
    { date: 'May', gets: 28000, revenue: 7500, orders: 300, subscribers: 950, sends: 28000 },
    { date: 'Jun', gets: 14000, revenue: 2000, orders: 80, subscribers: 350, sends: 14000 },
    { date: 'Jul', gets: 11000, revenue: 1500, orders: 60, subscribers: 280, sends: 11000 },
  ])

  return { accountMetrics, chartData }
})
