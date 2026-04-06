import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDaVinciStore = defineStore('davinci', () => {
  const isOpen = ref(false)
  const pendingQuery = ref('')

  function openWithQuery(query: string) {
    pendingQuery.value = query
    isOpen.value = true
  }

  function consumeQuery() {
    const q = pendingQuery.value
    pendingQuery.value = ''
    return q
  }

  return { isOpen, pendingQuery, openWithQuery, consumeQuery }
})
