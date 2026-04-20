import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type ProductId =
  | 'marketing'
  | 'commerce'
  | 'retail'
  | 'products'
  | 'service'
  | 'cdp_advanced'

export interface Account {
  id: string
  name: string
  initials: string
  color: string
  plan: string
  entitlements: ProductId[]
}

export const ACCOUNTS: Account[] = [
  {
    id: 'mmc',
    name: 'MMC-MSC-MCC Scooter Village',
    initials: 'MP',
    color: 'primary',
    plan: 'Growth',
    entitlements: ['marketing', 'service'],
  },
  {
    id: 'demo',
    name: 'Maropost Demo Store',
    initials: 'MD',
    color: 'secondary',
    plan: 'Growth Starter',
    entitlements: ['marketing'],
  },
  {
    id: 'enterprise',
    name: 'Nimbus Global Enterprise',
    initials: 'NG',
    color: 'teal',
    plan: 'Enterprise',
    entitlements: ['marketing', 'commerce', 'retail', 'products', 'service', 'cdp_advanced'],
  },
]

export const useAccountStore = defineStore('account', () => {
  const currentAccountId = ref<string>(ACCOUNTS[0].id)

  const currentAccount = computed<Account>(
    () => ACCOUNTS.find((a) => a.id === currentAccountId.value) ?? ACCOUNTS[0],
  )

  const entitlements = computed<Set<ProductId>>(
    () => new Set(currentAccount.value.entitlements),
  )

  function hasEntitlement(productId?: ProductId | null): boolean {
    if (!productId) return true
    return entitlements.value.has(productId)
  }

  function switchAccount(id: string) {
    if (ACCOUNTS.some((a) => a.id === id)) {
      currentAccountId.value = id
    }
  }

  return {
    accounts: ACCOUNTS,
    currentAccountId,
    currentAccount,
    entitlements,
    hasEntitlement,
    switchAccount,
  }
})

// Metadata describing each gated product — used by the cross-sell page and
// by route-matching logic to map paths → productId.
export interface ProductMeta {
  id: ProductId
  label: string
  tagline: string
  routePrefixes: string[]
}

export const GATED_PRODUCTS: ProductMeta[] = [
  {
    id: 'products',
    label: 'Products Cloud',
    tagline: 'Manage your catalog, inventory, and recommendations in one place.',
    routePrefixes: [
      '/product_recommendations',
      '/commerce/products',
      '/commerce/inventory',
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce Cloud',
    tagline: 'Operate your entire commerce business from one platform.',
    routePrefixes: [
      '/commerce/orders',
      '/commerce/fulfillments',
      '/commerce/coupons',
      '/commerce/store-setup',
      '/commerce/stores',
      '/commerce/themes',
    ],
  },
  {
    id: 'retail',
    label: 'Retail Cloud',
    tagline: 'Unify online and physical retail with POS, in-store inventory, and staff tools.',
    routePrefixes: ['/commerce/retail'],
  },
  {
    id: 'service',
    label: 'Service Cloud',
    tagline: 'Resolve tickets faster with unified customer context and AI-assisted replies.',
    routePrefixes: ['/service'],
  },
  {
    id: 'cdp_advanced',
    label: 'CDP Advanced',
    tagline: 'Unlock Lists, Fields, Tags, Relational Tables, SQL Queries, and Web Tracking.',
    routePrefixes: [
      '/lists',
      '/contacts/fields',
      '/tags',
      '/relational_tables',
      '/sql_queries',
      '/secure_lists',
      '/marketing/tracking_domains',
    ],
  },
]

export function productForPath(path: string): ProductId | null {
  for (const p of GATED_PRODUCTS) {
    if (p.routePrefixes.some((prefix) => path === prefix || path.startsWith(prefix + '/'))) {
      return p.id
    }
  }
  return null
}

export function productMeta(id: ProductId): ProductMeta | undefined {
  return GATED_PRODUCTS.find((p) => p.id === id)
}
