import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore, productForPath } from '@/stores/useAccount'

const routes = [
  // 1. Dashboard
  { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/DashboardView.vue') },
  
  // 2. Analytics (Reports)
  { path: '/analytics/reports/monthly_totals', name: 'MonthlyTotals', component: () => import('@/views/Analytics/MonthlyTotals.vue') },
  { path: '/analytics/reports/orders', name: 'OrdersReport', component: () => import('@/views/Analytics/OrdersReport.vue') },
  { path: '/analytics/reports/dispatched_orders', name: 'DispatchedOrders', component: () => import('@/views/Analytics/DispatchedOrders.vue') },
  { path: '/analytics/reports/sales_summary', name: 'SalesSummary', component: () => import('@/views/Analytics/SalesSummary.vue') },
  { path: '/analytics/reports/erfm', name: 'ERFMReport', component: () => import('@/views/Analytics/ERFMReport.vue') },
  { path: '/analytics/reports/campaign_reports', name: 'CampaignReports', component: () => import('@/views/Analytics/CampaignReports.vue') },
  { path: '/analytics/reports/recurring_campaign_reports', name: 'RecurringCampaignReports', component: () => import('@/views/Analytics/RecurringCampaignReports.vue') },
  { path: '/analytics/reports/ab_campaign_reports', name: 'ABCampaignReports', component: () => import('@/views/Analytics/ABCampaignReports.vue') },
  { path: '/analytics/reports/test_campaign_reports', name: 'TestCampaignReports', component: () => import('@/views/Analytics/TestCampaignReports.vue') },
  { path: '/analytics/reports/website_reports', name: 'WebsiteReports', component: () => import('@/views/Analytics/WebsiteReports.vue') },
  { path: '/analytics/reports/journey_reports', name: 'JourneyReports', component: () => import('@/views/Analytics/JourneyReports.vue') },
  { path: '/analytics/custom_reports', name: 'CustomReports', component: () => import('@/views/Analytics/CustomReports.vue') },
  { path: '/analytics/reports/transactional_campaign_reports', name: 'TransactionalReports', component: () => import('@/views/Analytics/TransactionalReports.vue') },
  { path: '/analytics/log_inspector', name: 'LogInspector', component: () => import('@/views/Analytics/LogInspector.vue') },

  // 3. Contacts (Audience)
  { path: '/contacts', name: 'AllContacts', component: () => import('@/views/Contacts/AllContacts.vue') },
  { path: '/contacts/:id', name: 'ContactDetail', component: () => import('@/views/Contacts/ContactDetail.vue') },
  { path: '/lists', name: 'ContactLists', component: () => import('@/views/Contacts/ContactLists.vue') },
  { path: '/segmentations', name: 'Segments', component: () => import('@/views/Contacts/Segments.vue') },
  { path: '/contacts/fields', name: 'ContactFields', component: () => import('@/views/Contacts/ContactFields.vue') },
  { path: '/tags', name: 'ContactTags', component: () => import('@/views/Contacts/ContactTags.vue') },
  { path: '/relational_tables', name: 'RelationalTables', component: () => import('@/views/Contacts/RelationalTables.vue') },
  { path: '/sql_queries', name: 'SQLQueries', component: () => import('@/views/Contacts/SQLQueries.vue') },
  { path: '/secure_lists', name: 'SecureLists', component: () => import('@/views/Contacts/SecureLists.vue') },
  { path: '/marketing/tracking_domains', name: 'WebTracking', component: () => import('@/views/Contacts/WebTracking.vue') },

  // 4. Products
  { path: '/product_recommendations', name: 'ProductRecommendations', component: () => import('@/views/Products/ProductRecommendations.vue') },
  { path: '/commerce/products', name: 'Products', component: () => import('@/views/Products/ProductsList.vue') },
  { path: '/commerce/products/tax-categories', name: 'TaxCategories', component: () => import('@/views/Products/TaxCategories.vue') },
  { path: '/commerce/products/collections', name: 'Collections', component: () => import('@/views/Products/Collections.vue') },
  { path: '/commerce/inventory', name: 'Inventory', component: () => import('@/views/Products/Inventory.vue') },
  { path: '/commerce/products/reservations', name: 'Reservations', component: () => import('@/views/Products/Reservations.vue') },

  // 5. Commerce
  { path: '/commerce/orders', name: 'SalesOrders', component: () => import('@/views/Commerce/SalesOrders.vue') },
  { path: '/commerce/orders/drafts', name: 'DraftOrders', component: () => import('@/views/Commerce/DraftOrders.vue') },
  { path: '/commerce/fulfillments', name: 'Fulfillments', component: () => import('@/views/Commerce/Fulfillments.vue') },
  { path: '/commerce/coupons', name: 'Coupons', component: () => import('@/views/Commerce/Coupons.vue') },
  { path: '/commerce/store-setup', name: 'StoreSetup', component: () => import('@/views/Commerce/StoreSetup.vue') },
  { path: '/commerce/stores/general', name: 'StoreGeneral', component: () => import('@/views/Commerce/StoreGeneral.vue') },
  { path: '/commerce/stores/themes', name: 'StoreThemes', component: () => import('@/views/Commerce/StoreThemes.vue') },
  { path: '/commerce/stores/navigation', name: 'StoreNavigation', component: () => import('@/views/Commerce/StoreNavigation.vue') },
  { path: '/commerce/themes/builder', name: 'StoreBuilder', component: () => import('@/views/Commerce/StoreBuilder.vue'), meta: { fullPage: true } },
  { path: '/commerce/retail', name: 'Retail', component: () => import('@/views/Commerce/Retail.vue') },

  // 6. Marketing
  { path: '/campaigns/new', name: 'CreateCampaign', component: () => import('@/views/Marketing/CreateCampaign.vue'), meta: { fullPage: true } },
  { path: '/campaigns', name: 'EmailCampaigns', component: () => import('@/views/Marketing/EmailCampaigns.vue') },
  { path: '/journeys/:id/builder', name: 'JourneyBuilder', component: () => import('@/views/Marketing/JourneyBuilder.vue'), meta: { fullPage: true } },
  { path: '/acquisition/forms/create', name: 'FormBuilder', component: () => import('@/views/Marketing/FormBuilder.vue'), meta: { fullPage: true } },
  { path: '/transactional_campaigns', name: 'TransactionalEmail', component: () => import('@/views/Marketing/TransactionalEmail.vue') },
  { path: '/campaign_tags', name: 'CampaignTags', component: () => import('@/views/Marketing/CampaignTags.vue') },
  { path: '/marketing/acquisition_forms', name: 'AcquisitionForms', component: () => import('@/views/Marketing/AcquisitionForms.vue') },
  { path: '/marketing/landing_pages', name: 'LandingPages', component: () => import('@/views/Marketing/LandingPages.vue') },
  { path: '/signup_forms', name: 'SignupForms', component: () => import('@/views/Marketing/SignupForms.vue') },
  { path: '/content/surveys', name: 'Surveys', component: () => import('@/views/Marketing/Surveys.vue') },
  { path: '/workflows', name: 'Journeys', component: () => import('@/views/Marketing/Journeys.vue') },
  { path: '/data_workflows', name: 'DataJourneys', component: () => import('@/views/Marketing/DataJourneys.vue') },
  { path: '/contents', name: 'EmailContent', component: () => import('@/views/Marketing/EmailContent.vue') },
  { path: '/dynamic_contents', name: 'DynamicContent', component: () => import('@/views/Marketing/DynamicContent.vue') },
  { path: '/images', name: 'ImageLibrary', component: () => import('@/views/Marketing/ImageLibrary.vue') },
  { path: '/footers', name: 'FooterManagement', component: () => import('@/views/Marketing/FooterManagement.vue') },
  { path: '/image_groups', name: 'OptimizeOnOpen', component: () => import('@/views/Marketing/OptimizeOnOpen.vue') },
  { path: '/content_feeds', name: 'ContentFeeds', component: () => import('@/views/Marketing/ContentFeeds.vue') },
  { path: '/coupon_banks', name: 'CouponBanks', component: () => import('@/views/Marketing/CouponBanks.vue') },
  { path: '/content/preference_pages', name: 'PreferencePages', component: () => import('@/views/Marketing/PreferencePages.vue') },
  { path: '/live_content_images', name: 'CountdownTimer', component: () => import('@/views/Marketing/CountdownTimer.vue') },

  // 7. Service
  { path: '/service/tickets', name: 'Tickets', component: () => import('@/views/Service/Tickets.vue') },

  // 8. Da Vinci
  {
    path: '/da-vinci',
    name: 'da-vinci',
    component: () => import('../views/DaVinci/DaVinciDashboard.vue')
  },
  {
    path: '/da-vinci/journeys',
    name: 'da-vinci-journeys',
    component: () => import('../views/DaVinci/DaVinciJourneys.vue')
  },
  {
    path: '/da-vinci/personalization',
    name: 'da-vinci-personalization',
    component: () => import('../views/DaVinci/DaVinciPersonalization.vue')
  },
  {
    path: '/da-vinci/marketing-assets', name: 'DaVinciMarketingAssets', component: () => import('@/views/DaVinci/MarketingAssets.vue')
  },
  { path: '/da-vinci/customer-bot', name: 'DaVinciCustomerBot', component: () => import('@/views/DaVinci/CustomerBot.vue') },
  { path: '/da-vinci/discover', name: 'DaVinciDiscover', component: () => import('@/views/Marketing/DaVinciDiscover.vue'), meta: { fullPage: true } },

  // 9. Integrations
  { path: '/integrations', name: 'Integrations', component: () => import('@/views/Integrations/Integrations.vue') },

  // 10. Settings & User Account (all panels live inside /settings)
  { path: '/settings', name: 'Settings', component: () => import('@/views/Settings/Settings.vue') },
  { path: '/design-system', name: 'DesignSystemDemo', component: () => import('@/views/Settings/DesignSystemDemo.vue') },
  { path: '/billing', redirect: '/settings' },
  { path: '/users', redirect: '/settings' },
  { path: '/profile', redirect: '/settings' },

  // Cross-sell landing pages
  { path: '/cross-sell/:product', name: 'CrossSell', component: () => import('@/views/CrossSell/CrossSellLanding.vue') },

  // Redirect root to dashboard
  { path: '/', redirect: '/dashboard' },
  // Catchall
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.path.startsWith('/cross-sell')) return
  const account = useAccountStore()
  const pid = productForPath(to.path)
  if (pid && !account.hasEntitlement(pid)) {
    return { path: `/cross-sell/${pid}` }
  }
})

export default router
