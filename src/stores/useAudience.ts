import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudienceStore = defineStore('audience', () => {
  const contacts = ref([
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', status: 'Subscribed', lastActive: '2026-03-06' },
    { id: 2, name: 'John Smith', email: 'john@example.com', status: 'Unsubscribed', lastActive: '2026-02-15' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'Subscribed', lastActive: '2026-03-07' },
    { id: 4, name: 'Bob Williams', email: 'bob@example.com', status: 'Bounced', lastActive: '2026-01-20' },
  ])

  function updateContactStatus(id: number, status: string) {
    const contact = contacts.value.find(c => c.id === id)
    if (contact) {
      contact.status = status
    }
  }

  return { contacts, updateContactStatus }
})
