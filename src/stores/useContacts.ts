import { defineStore } from 'pinia'
import { ref } from 'vue'

const firstNames = ['James', 'Sofia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'Logan', 'Mia', 'Lucas', 'Charlotte', 'Aiden', 'Amelia', 'Jackson', 'Harper', 'Sebastian', 'Evelyn', 'Mateo', 'Abigail', 'Jack', 'Emily', 'Owen', 'Ella', 'Theodore', 'Scarlett', 'Henry', 'Grace', 'Alexander', 'Chloe', 'Benjamin', 'Zoe', 'William', 'Penelope', 'Daniel', 'Lily', 'Michael', 'Victoria', 'David', 'Aurora', 'Joseph', 'Nora', 'Samuel', 'Hannah', 'Carter', 'Stella', 'Ryan', 'Leah']
const lastNames = ['Anderson', 'Thompson', 'Martinez', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Robinson', 'Clark', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers']
const companies = ['Acme Corp', 'TechFlow Inc', 'BlueSky Ventures', 'Meridian Solutions', 'Apex Digital', 'Horizon Media', 'Stellar Commerce', 'Orbit Labs', 'Nova Group', 'Peak Partners', 'Zenith Corp', 'Summit Digital', 'Atlas Ventures', 'Cascade Media', 'Ridge Analytics', null, null, null, null, null]
const cities = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Chicago, IL', 'Seattle, WA', 'Miami, FL', 'Boston, MA', 'Denver, CO', 'Los Angeles, CA', 'Phoenix, AZ', 'Portland, OR', 'Atlanta, GA', 'Nashville, TN', 'Charlotte, NC', 'Minneapolis, MN']
const statuses = ['Subscribed', 'Subscribed', 'Subscribed', 'Unsubscribed', 'Bounced', 'Spam', 'Subscribed', 'Subscribed', 'Unsubscribed', 'Subscribed']
const tags = [['VIP', 'Loyal'], ['Newsletter'], ['Sale Buyer'], ['Referral'], ['High Value'], [], ['Re-engagement'], ['VIP'], ['Churned'], ['New']]

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref(firstNames.map((fName, i) => {
    const lName = lastNames[i % lastNames.length]
    const status = statuses[i % statuses.length]
    const company = companies[i % companies.length]
    return {
      id: i + 1,
      firstName: fName,
      lastName: lName,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@${['gmail.com', 'outlook.com', 'company.io', 'example.com', 'mail.com'][i % 5]}`,
      phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company,
      location: cities[i % cities.length],
      status,
      score: Math.floor(Math.random() * 100),
      tags: tags[i % tags.length],
      revenue: status === 'Subscribed' ? (Math.random() * 2000).toFixed(2) : '0.00',
      orders: status === 'Subscribed' ? Math.floor(Math.random() * 15) : 0,
      lastActive: new Date(Date.now() - (Math.random() * 7776000000)).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - (Math.random() * 31536000000)).toISOString().split('T')[0],
    }
  }))

  const segments = ref([
    { id: 1, name: 'High Value Customers', description: 'Contacts with LTV > $500', count: 1842, type: 'Dynamic', status: 'Active', lastCalc: '2026-03-07' },
    { id: 2, name: 'Lapsed 90 Days', description: 'No activity in 90+ days', count: 4201, type: 'Dynamic', status: 'Active', lastCalc: '2026-03-07' },
    { id: 3, name: 'Newsletter Subscribers', description: 'Opted in to weekly newsletter', count: 18432, type: 'Static', status: 'Active', lastCalc: '2026-03-06' },
    { id: 4, name: 'Abandoned Cart - 7 Days', description: 'Cart abandoned in last 7 days', count: 892, type: 'Dynamic', status: 'Active', lastCalc: '2026-03-07' },
    { id: 5, name: 'VIP Members', description: 'Tagged as VIP or Loyalty tier', count: 312, type: 'Static', status: 'Active', lastCalc: '2026-03-05' },
    { id: 6, name: 'New Signups - 30 Days', description: 'Joined in the last 30 days', count: 2341, type: 'Dynamic', status: 'Active', lastCalc: '2026-03-07' },
    { id: 7, name: 'Repeat Buyers', description: '2+ orders in any period', count: 5621, type: 'Dynamic', status: 'Active', lastCalc: '2026-03-06' },
    { id: 8, name: 'SMS Opted-In', description: 'Consented to SMS marketing', count: 7892, type: 'Static', status: 'Active', lastCalc: '2026-03-04' },
    { id: 9, name: 'Bounced Emails', description: 'Hard or soft email bounces', count: 1243, type: 'Dynamic', status: 'Active', lastCalc: '2026-03-07' },
    { id: 10, name: 'Re-Engagement Targets', description: '120+ days inactive, still subscribed', count: 3102, type: 'Dynamic', status: 'Paused', lastCalc: '2026-02-28' },
    { id: 11, name: 'Flash Sale Buyers', description: 'Purchased during last flash sale', count: 4892, type: 'Static', status: 'Active', lastCalc: '2026-03-01' },
    { id: 12, name: 'Referral Program', description: 'Joined via referral link', count: 923, type: 'Static', status: 'Active', lastCalc: '2026-03-05' },
  ])

  const lists = ref([
    { id: 1, name: 'Master Subscriber List', subscribers: 45231, bounced: 1243, unsubscribed: 2891, type: 'General', created: '2023-01-15' },
    { id: 2, name: 'Newsletter Opt-in', subscribers: 18432, bounced: 342, unsubscribed: 891, type: 'Newsletter', created: '2023-02-01' },
    { id: 3, name: 'VIP Customer Circle', subscribers: 312, bounced: 4, unsubscribed: 12, type: 'Premium', created: '2023-06-15' },
    { id: 4, name: 'Product Announcement', subscribers: 32891, bounced: 892, unsubscribed: 1432, type: 'Transactional', created: '2023-03-10' },
    { id: 5, name: 'Black Friday 2025', subscribers: 28412, bounced: 412, unsubscribed: 2341, type: 'Campaign', created: '2025-10-01' },
    { id: 6, name: 'Abandoned Cart Recovery', subscribers: 4231, bounced: 89, unsubscribed: 341, type: 'Automation', created: '2023-08-20' },
    { id: 7, name: 'Re-engagement 2024', subscribers: 8912, bounced: 1232, unsubscribed: 3421, type: 'Campaign', created: '2024-01-10' },
    { id: 8, name: 'SMS Marketing List', subscribers: 7892, bounced: 34, unsubscribed: 123, type: 'SMS', created: '2024-03-01' },
  ])

  return { contacts, segments, lists }
})
