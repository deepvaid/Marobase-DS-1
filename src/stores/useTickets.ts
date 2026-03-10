import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Ticket {
  id: number
  number: string
  subject: string
  customer: string
  customerEmail: string
  avatar: string
  status: 'Open' | 'In Progress' | 'Awaiting Reply' | 'Resolved'
  priority: 'Low' | 'Normal' | 'High' | 'Urgent'
  category: string
  assignee: string
  createdAt: string
  updatedAt: string
  tags: string[]
  thread: { author: string; avatar: string; role: 'customer' | 'agent'; body: string; time: string }[]
}

const customerNames = ['James Anderson', 'Sofia Thompson', 'Liam Martinez', 'Emma Johnson', 'Noah Williams', 'Olivia Brown', 'Ethan Davis', 'Ava Miller', 'Mason Wilson', 'Isabella Moore']
const subjects = [
  'Order #10002 — Where is my shipment?',
  'Refund request for damaged item',
  'Cannot login to my account',
  'Product size exchange request',
  'Billing charged twice this month',
  'Coupon code WELCOME20 not working',
  'Missing item from order #10008',
  'Request to update shipping address',
  'Product quality complaint — Nike Air Max',
  'How do I cancel my subscription?',
  'Wrong item delivered in my order',
  'Loyalty points not showing in account',
  'Request for bulk order discount',
  'Account email change request',
  'Return label not received via email',
  'Patagonia Vest arrived with a defect',
  'Payment failed but amount deducted',
  'Asking about international shipping',
  'Tracking link is not updating',
  'Website checkout keeps crashing',
]
const categories = ['Shipping', 'Returns & Refunds', 'Account', 'Product', 'Billing', 'Technical']
const assignees = ['Sarah Connor', 'Mike Zhang', 'Priya Sharma', 'Tom Brady', 'Unassigned']

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<Ticket[]>(subjects.map((subject, i) => {
    const cust = customerNames[i % customerNames.length]
    const parts = cust.split(' ')
    const statuses: Ticket['status'][] = ['Open', 'In Progress', 'Awaiting Reply', 'Resolved']
    const priorities: Ticket['priority'][] = ['Urgent', 'High', 'Normal', 'Low', 'Normal', 'High']
    const status = statuses[i % statuses.length]
    return {
      id: i + 1,
      number: `TKT-${String(10000 + i).padStart(5, '0')}`,
      subject,
      customer: cust,
      customerEmail: `${parts[0].toLowerCase()}@example.com`,
      avatar: `${parts[0][0]}${parts[1][0]}`,
      status,
      priority: priorities[i % priorities.length],
      category: categories[i % categories.length],
      assignee: assignees[i % assignees.length],
      createdAt: new Date(Date.now() - ((i + 1) * 7200000)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 1800000)).toISOString(),
      tags: i % 3 === 0 ? ['VIP'] : i % 5 === 0 ? ['Flagged'] : [],
      thread: [
        {
          author: cust,
          avatar: `${parts[0][0]}${parts[1][0]}`,
          role: 'customer',
          body: `Hi, I have an issue with my recent order. ${subject}. Could you please help me resolve this as soon as possible? My order number is #${10000 + i}.`,
          time: new Date(Date.now() - ((i + 1) * 7200000)).toLocaleString(),
        },
        ...(status !== 'Open' ? [{
          author: assignees[i % (assignees.length - 1)],
          avatar: assignees[i % (assignees.length - 1)].split(' ').map(n => n[0]).join(''),
          role: 'agent' as const,
          body: `Thank you for reaching out! I've looked into your request and I'm on it. We'll get this sorted for you within 24 hours. Apologies for any inconvenience caused.`,
          time: new Date(Date.now() - (i * 3600000)).toLocaleString(),
        }] : []),
        ...(status === 'Awaiting Reply' ? [{
          author: cust,
          avatar: `${parts[0][0]}${parts[1][0]}`,
          role: 'customer' as const,
          body: `Thank you for the update! Just to confirm — will the replacement be shipped to the same address?`,
          time: new Date(Date.now() - (i * 1800000)).toLocaleString(),
        }] : []),
      ],
    }
  }))

  const activeTicketId = ref<number>(1)

  function setActive(id: number) {
    activeTicketId.value = id
  }

  function replyToTicket(ticketId: number, body: string) {
    const ticket = tickets.value.find(t => t.id === ticketId)
    if (ticket) {
      ticket.thread.push({
        author: 'Sarah Connor',
        avatar: 'SC',
        role: 'agent',
        body,
        time: new Date().toLocaleString(),
      })
      ticket.status = 'Awaiting Reply'
      ticket.updatedAt = new Date().toISOString()
    }
  }

  return { tickets, activeTicketId, setActive, replyToTicket }
})
