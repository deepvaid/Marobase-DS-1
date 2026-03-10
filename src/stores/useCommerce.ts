import { defineStore } from 'pinia'
import { ref } from 'vue'

const productNames = [
  'Nike Air Max 270 - Black/White', 'Patagonia Better Sweater Fleece Vest', 'Apple iPhone 15 Pro Case - Clear',
  'Samsung 65" QLED 4K Smart TV', 'Levi\'s 501 Original Fit Jeans', 'Sony WH-1000XM5 Headphones',
  'Instant Pot Duo 7-in-1 Pressure Cooker', 'Kindle Paperwhite 16GB', 'Hydro Flask 32oz Wide Mouth',
  'Allbirds Tree Runners - Wool White', 'YETI Rambler 20oz Tumbler', 'Dyson V15 Detect Vacuum',
  'TheraGun Pro Massage Device', 'Lululemon Align Leggings 25"', 'Stanley Adventure Quencher 40oz',
  'GoPro HERO12 Black Action Camera', 'KitchenAid Stand Mixer 5Qt - Red', 'Vitamix 5200 Blender',
  'Ember Smart Mug 2 - 14oz', 'Anker 65W USB-C Charging Hub', 'Bose QuietComfort Earbuds II',
  'Away Carry-On Luggage - Bigger', 'Le Creuset Dutch Oven 5.5qt - Blue', 'Oura Ring Gen 3 - Gold',
  'Sonos Era 300 Speaker', 'Purple Hybrid Premier 3 Mattress', 'Breville Espresso Machine Pro',
  'Nespresso Vertuo Next Coffee Maker', 'Peloton Bike+ Guide Bundle', 'Anova Culinary Sous Vide Precision',
  'Rtic 45 Qt Hard Cooler', 'Zojirushi Rice Cooker 5.5 Cup', 'Weber Genesis E-325s Gas Grill',
  'Traeger Ranger Portable Pellet Grill', 'DEWALT 20V MAX Cordless Drill', 'Roomba j7+ Self-Emptying Robot',
  'Philips Hue Starter Kit A19', 'Nest Learning Thermostat - 4th Gen', 'Ring Video Doorbell Pro 2',
  'Tile Pro Bluetooth Tracker 4-Pack',
]
const categories = ['Electronics', 'Apparel', 'Home & Kitchen', 'Sports & Outdoors', 'Beauty & Health', 'Tools & Garden']
const customerFirstNames = ['James', 'Sofia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'Logan', 'Mia', 'Lucas', 'Charlotte', 'Aiden', 'Amelia', 'Jackson', 'Harper', 'Sebastian', 'Evelyn', 'Mateo', 'Abigail', 'Jack', 'Emily', 'Owen', 'Ella', 'Theodore', 'Scarlett', 'Henry', 'Grace']
const customerLastNames = ['Anderson', 'Thompson', 'Martinez', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Thompson', 'Robinson', 'Clark', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill']
const cities = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Chicago, IL', 'Seattle, WA', 'Miami, FL', 'Boston, MA', 'Denver, CO', 'Los Angeles, CA', 'Phoenix, AZ']
// Real Maropost order status values
const orderStatuses = ['Processing', 'Completed', 'Cancelled', 'Refunded', 'On Hold']
const fulfillmentStatuses = ['Not Ready', 'Ready For Fulfillment', 'Shipped', 'Return Requested', 'Cancelled', 'Unapproved']
const paymentMethods = ['Visa •••• 4242', 'Mastercard •••• 8888', 'Amex •••• 1234', 'PayPal', 'Shop Pay', 'Apple Pay']

export const useCommerceStore = defineStore('commerce', () => {
  const products = ref(productNames.map((name, i) => {
    const inv = i < 3 ? 0 : Math.floor(Math.random() * 500) + 5
    const price = (Math.random() * 450 + 15).toFixed(2)
    return {
      id: 1000 + i,
      name,
      sku: `SKU-${String(10000 + i).padStart(5, '0')}`,
      price,
      compareAtPrice: (parseFloat(price) * 1.2).toFixed(2),
      inventory: inv,
      category: categories[i % categories.length],
      status: inv === 0 ? 'Out of Stock' : inv < 20 ? 'Low Stock' : 'In Stock',
      vendor: ['Acme Corp', 'Brand House', 'Global Goods', 'Prime Supplier', 'Local Artisan'][i % 5],
      images: 1,
      variants: Math.floor(Math.random() * 4) + 1,
    }
  }))

  const orders = ref(Array.from({ length: 30 }, (_, i) => {
    const fName = customerFirstNames[i % customerFirstNames.length]
    const lName = customerLastNames[i % customerLastNames.length]
    const itemCount = Math.floor(Math.random() * 5) + 1
    const subtotal = (Math.random() * 980 + 45).toFixed(2)
    const shipping = (Math.random() * 25 + 4.99).toFixed(2)
    const total = (parseFloat(subtotal) + parseFloat(shipping)).toFixed(2)
    const status = orderStatuses[i % orderStatuses.length]
    const fulfillmentStatus = fulfillmentStatuses[i % fulfillmentStatuses.length]
    const trackingNum = `1Z${Math.random().toString(36).substring(2, 11).toUpperCase()}`

    return {
      id: i + 1,
      orderNumber: `#${10000 + i}`,
      customer: { name: `${fName} ${lName}`, email: `${fName.toLowerCase()}.${lName.toLowerCase()}@email.com`, avatar: `${fName[0]}${lName[0]}` },
      city: cities[i % cities.length],
      itemCount,
      subtotal,
      shipping,
      total,
      status,
      fulfillmentStatus,
      paymentStatus: status === 'Refunded' ? 'Refunded' : status === 'Cancelled' ? 'Voided' : 'Paid',
      paymentMethod: paymentMethods[i % paymentMethods.length],
      trackingNumber: fulfillmentStatus === 'Shipped' ? trackingNum : null,
      courier: fulfillmentStatus === 'Shipped' ? ['UPS', 'FedEx', 'USPS', 'DHL'][i % 4] : null,
      date: new Date(Date.now() - (i * 86400000 * 1.2)).toISOString().split('T')[0],
      lineItems: Array.from({ length: itemCount }, (_, j) => ({
        product: productNames[(i + j) % productNames.length],
        sku: `SKU-${String(10000 + (i + j) % productNames.length).padStart(5, '0')}`,
        qty: Math.floor(Math.random() * 3) + 1,
        price: (Math.random() * 150 + 10).toFixed(2),
      })),
      notes: i % 7 === 0 ? 'Customer requested gift wrapping.' : null,
    }
  }))

  const coupons = ref([
    { id: 1, code: 'WELCOME20', type: 'Percentage', value: 20, minOrder: 50, usage: 342, limit: 1000, expiry: '2026-06-30', status: 'Active' },
    { id: 2, code: 'FREESHIP', type: 'Free Shipping', value: 0, minOrder: 75, usage: 1204, limit: null, expiry: null, status: 'Active' },
    { id: 3, code: 'BLACKFRI50', type: 'Percentage', value: 50, minOrder: 100, usage: 8921, limit: 10000, expiry: '2025-11-30', status: 'Expired' },
    { id: 4, code: 'SUMMER15', type: 'Percentage', value: 15, minOrder: 0, usage: 567, limit: 500, expiry: '2026-08-31', status: 'Maxed Out' },
    { id: 5, code: 'VIP30OFF', type: 'Fixed Amount', value: 30, minOrder: 150, usage: 89, limit: 200, expiry: '2026-12-31', status: 'Active' },
    { id: 6, code: 'NEWUSER10', type: 'Fixed Amount', value: 10, minOrder: 0, usage: 2341, limit: null, expiry: '2026-03-31', status: 'Active' },
    { id: 7, code: 'LOYALTY25', type: 'Percentage', value: 25, minOrder: 200, usage: 156, limit: 500, expiry: '2026-09-30', status: 'Active' },
    { id: 8, code: 'FLASH5', type: 'Fixed Amount', value: 5, minOrder: 0, usage: 4523, limit: 5000, expiry: '2025-12-31', status: 'Expired' },
    { id: 9, code: 'REFER20', type: 'Percentage', value: 20, minOrder: 0, usage: 234, limit: null, expiry: null, status: 'Active' },
    { id: 10, code: 'HOLIDAY40', type: 'Percentage', value: 40, minOrder: 75, usage: 12, limit: 300, expiry: '2026-12-25', status: 'Active' },
    { id: 11, code: 'BUNDLESAVE', type: 'Fixed Amount', value: 25, minOrder: 120, usage: 78, limit: 200, expiry: '2026-06-30', status: 'Active' },
    { id: 12, code: 'SPRING10', type: 'Percentage', value: 10, minOrder: 0, usage: 892, limit: null, expiry: '2026-05-31', status: 'Active' },
  ])

  const fulfillments = ref(Array.from({ length: 18 }, (_, i) => {
    const fName = customerFirstNames[(i + 5) % customerFirstNames.length]
    const lName = customerLastNames[(i + 5) % customerLastNames.length]
    const statuses = ['Awaiting Fulfillment', 'Picking', 'Packed', 'Ready to Ship', 'Shipped']
    return {
      id: i + 1,
      orderNumber: `#${10015 + i}`,
      customer: `${fName} ${lName}`,
      items: Math.floor(Math.random() * 4) + 1,
      weight: `${(Math.random() * 5 + 0.3).toFixed(1)} lbs`,
      status: statuses[i % statuses.length],
      location: cities[i % cities.length],
      date: new Date(Date.now() - (i * 43200000)).toISOString().split('T')[0],
      priority: i < 3 ? 'High' : i < 8 ? 'Normal' : 'Low',
    }
  }))

  const draftOrders = ref(Array.from({ length: 8 }, (_, i) => {
    const fName = customerFirstNames[(i + 15) % customerFirstNames.length]
    const lName = customerLastNames[(i + 15) % customerLastNames.length]
    return {
      id: i + 1,
      draftNumber: `D-${500 + i}`,
      customer: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}@example.com`,
      items: Math.floor(Math.random() * 5) + 1,
      total: (Math.random() * 600 + 30).toFixed(2),
      status: ['Open', 'Invoice Sent', 'Invoice Sent'][i % 3],
      createdAt: new Date(Date.now() - (i * 86400000 * 2)).toISOString().split('T')[0],
    }
  }))

  return { products, orders, coupons, fulfillments, draftOrders }
})
