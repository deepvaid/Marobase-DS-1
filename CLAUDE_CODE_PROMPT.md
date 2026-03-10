# Claude Code Prompt — Maropost Desktop App Redesign
## Commerce + Marketing Platform for Merchants

---

## 🎯 MISSION

You are a senior UX designer and front-end engineer tasked with **completely redesigning the Maropost desktop app** — a combined Commerce + Marketing SaaS platform for merchants. The goal is to create a world-class, modern, highly usable interface built with **Vuetify 3** (Vue 3 + TypeScript), drawing design inspiration from **Shopify**, **Mailchimp**, **Wix**, and **Linear**.

The prototype code is already in this folder. **Read every single file before touching anything.**

---

## 🔍 ACTUAL APP — WHAT WE OBSERVED (Read this before touching anything)

This section documents the **real live app** as explored on 7 March 2026. Use this as ground truth for all redesign decisions.

### Real Navigation Architecture (confirmed from live app)

```
Dashboard  (Marketing / Service / Commerce tabs)
Analytics
  ├── Monthly Totals
  ├── Sales by Order
  ├── Dispatched Orders
  ├── Sales Summary
  ├── Campaign Reports        ← columns: Name, Contacts, Sent, Delivered, Opens, Clicks, Bounces, Revenue, Sent At
  ├── Recurring Campaign Reports
  ├── A/B Campaign Reports
  ├── Test Campaign Reports
  ├── Website Reports
  ├── Journey Reports
  ├── Custom Reports
  ├── Transactional Email Reports
  └── Log Inspector
Contacts
  ├── All Contacts            ← 935 real contacts; columns: Name, Email, Phone, Created At, Updated At
  ├── Contact Lists
  ├── Segments
  ├── Contact Fields
  ├── Contact Tags
  ├── Relational Tables
  ├── SQL Queries
  ├── Secure Lists
  └── Web Tracking
Products  (expandable)
Commerce
  ├── Orders
  │   ├── Sales Orders        ← URL: /commerce/2000290/orders — 1,471 real orders
  │   ├── Draft Orders
  │   └── Fulfillment
  ├── Promos & Coupons
  └── Sales Channels
Marketing
  ├── Campaigns
  │   ├── Email Campaigns     ← 8 campaigns; columns: Name, Contacts, Status, Sent At, Updated At
  │   ├── Transactional Email
  │   └── Campaign Tags
  ├── Acquisition
  ├── Automation
  │   ├── Journeys            ← 81 journeys; toggle switch for active/inactive per row
  │   └── Data Journeys
  └── Content
      ├── Email Content
      ├── Dynamic Content
      ├── Image Library
      ├── Footer Management
      ├── Optimise on Open
      ├── Content Feeds
      ├── Coupon Banks
      ├── Preference Management
      └── Countdown Timer
Service
Da Vinci  [NEW badge]
Integrations
Settings
```

### ⚠️ Critical URL Routing — Two Different URL Patterns

The app uses **two separate URL namespaces** — you must handle both:
- **Marketing/Contacts/Analytics** → `/accounts/2000290/[section]`
- **Commerce** → `/commerce/2000290/[section]`

Direct navigation to `/accounts/2000290/commerce/orders` returns a **404**. Always use the sidebar nav links or the correct `/commerce/` prefix for Commerce pages.

### Real Data Shapes (from live observations)

**Sales Orders** (`/commerce/2000290/orders`) — 1,471 orders
- Table columns: Order #, Contact (email), Fulfillment Status, Payment Status, Status, Sales Channel, Total ($), Date Added
- **Two separate status columns**: Fulfillment Status AND Payment Status — not one combined status
- Fulfillment Status values: `Unapproved`, `Cancelled`, `Return Requested`, `Not Ready`, `Shipped`, `Ready For Fulfillment`
- Payment Status values: `Not Paid`, `Paid`, `Requires Action`
- Order Status values: `Pending`, `Processing`, `Completed`, `Cancelled`
- Table tabs: ALL / COMPLETED ORDERS / PROCESSING / NOT FULFILLED / ADD FILTER +
- Primary CTA: "CREATE DRAFT ORDER" button (not "Create Order")

**Email Campaigns** (`/accounts/2000290/campaigns`) — 8 campaigns
- Table columns: Name, Contacts, Status, Sent At, Updated At, Actions (copy icon + kebab menu)
- Status values: `Sent` (green outline chip), `Stopped` (red outline chip), `Draft` (grey outline chip)
- Filter: "All" dropdown top right + "NEW CAMPAIGN" black button
- Breadcrumb: "My Campaigns" above the page title
- Notable: "Change Content URL" button at bottom of page (unusual — flag this)

**Journeys** (`/accounts/2000290/journeys`) — 81 journeys
- Table columns: Name, Journey Status (toggle switch inline!), Contacts, Active Contacts, Items, Created At, Updated At, Actions
- Journey Status is a **blue toggle switch** not a chip — active journeys show blue toggle ON
- Actions column: kebab menu (⋮) + refresh icon button
- Primary CTA: "NEW JOURNEY" black button + "All" dropdown filter
- Breadcrumb: "My Journeys"

**Campaign Reports** (`/accounts/2000290/reports`) — 11 reports
- Table columns: Name, Contacts, Sent, Delivered, Opens (linked), Clicks (linked), Bounces (linked), Total Revenue, Sent At
- Opens/Clicks/Bounces are **blue hyperlinks** (drill-down to detail)
- Date range: "Start Date" + "End Date" calendar pickers top right (no preset ranges shown)

**Contacts** (`/accounts/2000290/contacts`) — 935 contacts
- Simple table, many rows have `--` for Name (no name captured)
- Buttons: "IMPORT" (outlined) + "NEW CONTACT" (filled black)
- Breadcrumb: "My Contacts"

**Settings** (`/accounts/2000290/settings`)
- **Horizontal tabs** at top: Connections, DNS Setup, Contacts, Campaigns, Store Setup, Others, Service, Channels
- Plus a **"Search by keyword"** input at top — searches across all settings
- Settings items are displayed as **icon cards in a 3-column grid** (not a list)
- Connections: API Keys, JSON Web Token, Relational Tables, SFTP Access, HTTP Post URL, Conversion Attribution
- DNS Setup: Sending Domains, Link Tracking Domains, Brand Management
- Contacts: Global Suppression Lists, Bulk Delete Contacts, Cleansing Rules
- Campaigns: Test Campaign Subject Line
- Store Setup: Region, Account Config, Manage Reasons, Warehouses, Product Categories, Taxes, Packages, Fulfillment Agent, Shipping Settings, Email Templates
- Others: 301 Redirects, Custom Domains, Custom Fields, Archives
- Service: Reply Templates, Ticket Types, Ticket Tags
- Channels: Support Email

**Dashboard** — widget-based, customisable
- 3 tabs across top: MARKETING / SERVICE / COMMERCE
- "+ ADD WIDGET" button top right
- Default Marketing widgets: Email Address by Domain (donut chart), Deliverability Score (gauge: 10/10), Recent Sent Campaigns (table), Email Usage (chart), Email Volume (chart)
- Greeting: "Good Evening, Deepak!" with current time displayed in header (01:18 PM EDT)

### Key UX Pain Points Observed

1. **Inconsistent page headers** — some pages have a "My [X]" breadcrumb above the title, others don't
2. **No search on most list pages** — Contacts, Campaigns, Journeys have no inline search
3. **Status chips are outline-only** — low visual contrast, hard to scan quickly
4. **Campaign actions hidden in kebab menus** — copy icon + ⋮ menu, no primary action visible
5. **"Change Content URL" button** on Email Campaigns page has no context — confusing placement
6. **Analytics has no overview page** — jumps straight to sub-reports, no rollup dashboard
7. **Settings uses keyword search** — good pattern, should be preserved
8. **Journey status is a toggle switch in the table** — preserve this interaction pattern, it's smart
9. **Dual URL namespace** (accounts/ vs commerce/) causes navigation confusion — redesign should unify this in the Vue router
10. **No empty states with guidance** — empty tables just show "Loading items..." or nothing

---

## 🔐 LIVE APP ACCESS

Before writing any code, **visit the live production app** to deeply understand:
- Current information architecture
- Actual data shapes, labels, and workflows
- Where merchants spend the most time
- Pain points and inconsistencies in the current UI

**Live App URL:** https://beta.maropost.com/accounts/2000290/dashboard
**Login:** Deepak.v@maropost.com
**Password:** Onthejob@25

> ⚠️ If you need authentication tokens, API keys, or session cookies to inspect network requests or API contracts, **ask me first before proceeding** — do not guess or hardcode anything sensitive.

---

## 📁 CODEBASE — READ EVERYTHING FIRST

The project is a **Vue 3 + Vuetify 3 + TypeScript + Vite + Pinia** app. Before making any changes:

1. **Read `package.json`** — understand all dependencies
2. **Read `src/main.ts` and `src/plugins/`** — understand Vuetify configuration and theming setup
3. **Read `src/router/`** — understand all routes
4. **Read `src/stores/`** — understand all Pinia stores and state shape
5. **Read every file in `src/views/`** — all view components including:
   - `DashboardView.vue`
   - `AudienceView.vue`
   - `Commerce/` — SalesOrders, DraftOrders, Fulfillments, StoreSetup, Coupons
   - `Marketing/` — EmailCampaigns, CreateCampaign, JourneyBuilder, Journeys, DataJourneys, SignupForms, AcquisitionForms, LandingPages, Surveys, FormBuilder, ImageLibrary, EmailContent, ContentFeeds, DynamicContent, CouponBanks, CampaignTags, CountdownTimer, FooterManagement, OptimizeOnOpen, PreferencePages, TransactionalEmail
   - `Analytics/`, `Contacts/`, `DaVinci/`, `Integrations/`, `Products/`, `Service/`, `Settings/`
6. **Read `src/components/layout/`** — nav, sidebar, header components
7. **Read `src/App.vue`** — root component
8. **Read `src/styles/`** — all CSS/SCSS

Only begin redesign work after you have a complete mental model of the entire app.

---

## 🏗️ WHAT TO REDESIGN

### 1. Global Layout & Navigation Shell

**Inspired by:** Shopify Admin, Linear, Notion

- Implement a **fixed left sidebar** (260px wide) with:
  - Maropost logo / account switcher at the top
  - Grouped navigation sections: **Commerce**, **Marketing**, **Contacts**, **Analytics**, **Settings**
  - Each section collapsible with a `v-list-group`
  - Active state with a pill/highlight indicator
  - Bottom section: account avatar, help, notifications
- **Top app bar** (56px): breadcrumbs, global search (`v-text-field` with search icon), notifications bell, user avatar menu
- **Main content area**: `max-width: 1280px`, centered, with consistent `24px` padding
- Smooth sidebar collapse to icon-only mode (rail mode using Vuetify's `v-navigation-drawer` `rail` prop)
- Use `v-app`, `v-navigation-drawer`, `v-app-bar`, `v-main` correctly

### 2. Design System & Theming

**Inspired by:** Shopify Polaris color system, Mailchimp's warm neutrals

Define a cohesive Vuetify theme in `src/plugins/vuetify.ts`:

```
Primary:     #1A56DB  (action blue — buttons, links, active states)
Secondary:   #7E3AF2  (marketing purple — journey/campaign accents)
Success:     #0E9F6E
Warning:     #FF5A1F
Error:       #E02424
Surface:     #FFFFFF
Background:  #F9FAFB  (page background — very light grey)
Border:      #E5E7EB
Text Primary: #111928
Text Muted:  #6B7280
```

Typography:
- Font: `Inter` (import from Google Fonts)
- Heading sizes: h1=28px/700, h2=22px/600, h3=18px/600, body=14px/400, label=12px/500
- Apply via Vuetify's `defaults` system

Spacing: use Vuetify's `ma-*`, `pa-*` utilities consistently on an 8px grid.

Elevation: avoid heavy drop shadows — use `border: 1px solid #E5E7EB` cards instead (flat design like Shopify/Linear).

### 3. Dashboard (`DashboardView.vue`)

**Inspired by:** Shopify Home, Mailchimp Dashboard

- **Welcome header** with merchant name and today's date
- **KPI stat cards row** (4 cards): Total Revenue, Orders Today, Active Campaigns, Email Open Rate — each as a flat `v-card` with large metric number, % change badge (green/red), and sparkline chart
- **Quick Actions strip**: "Create Campaign", "Add Product", "View Orders", "Add Contact" — icon buttons in a horizontal row
- **Main grid (2-column)**:
  - Left (60%): Recent Orders table with status chips, order number, customer, amount
  - Right (40%): Top Campaigns list with open rate progress bars
- **Bottom row**: Revenue chart (last 30 days, line chart using a charting lib or SVG) + Audience growth chart

### 4. Commerce Section

**Inspired by:** Shopify Orders UI

**Sales Orders:**
- Full-width data table using `v-data-table` with real columns from live app: Order #, Contact (email), Fulfillment Status, Payment Status, Order Status, Sales Channel, Total ($), Date Added
- **Three separate status chip columns** — do NOT combine them:
  - Fulfillment Status: `Unapproved` (orange), `Not Ready` (grey), `Ready For Fulfillment` (blue), `Shipped` (green), `Return Requested` (amber), `Cancelled` (red)
  - Payment Status: `Not Paid` (red tonal), `Paid` (green tonal), `Requires Action` (orange tonal)
  - Order Status: `Pending` (grey), `Processing` (blue), `Completed` (green), `Cancelled` (red)
- Table tabs matching live app: ALL / COMPLETED ORDERS / PROCESSING / NOT FULFILLED + ADD FILTER
- Primary CTA: "CREATE DRAFT ORDER" (matches live app exactly)
- Filters bar above table: Sales Channel dropdown, date range picker, status dropdowns
- Bulk actions: select all, bulk fulfill, export CSV
- Click row → opens a right-side `v-navigation-drawer` order detail panel (not a separate page)

**Draft Orders:**
- Same table pattern but with "Convert to Order" CTA per row
- Empty state with illustration + "Create your first draft order" button

**Fulfillments:**
- Timeline/stepper view per order showing fulfillment stages
- Carrier info, tracking number input field, status update button

**Store Setup:**
- Multi-section settings page using `v-tabs` (vertical on left):
  - General, Payments, Shipping, Taxes, Notifications
- Each tab = a form with `v-text-field`, `v-select`, `v-switch` components
- Save button sticky at bottom of each section

**Coupons:**
- Card grid of coupons showing: code, discount type, usage count/limit, expiry, status toggle
- "Create Coupon" drawer with full form

### 5. Marketing Section

**Inspired by:** Mailchimp Campaigns, Klaviyo

**Email Campaigns:**
- **Campaign list** with `v-data-table`: Name, Type, Status chip, Sent date, Open Rate, Click Rate, Actions
- Status lifecycle: `Draft` → `Scheduled` → `Sending` → `Sent`
- Tabs: All, Drafts, Scheduled, Sent, Automated
- Stats at top: total sent this month, avg open rate, avg click rate

**Create Campaign:**
- Multi-step wizard using `v-stepper`:
  1. **Setup** — Campaign name, type (Regular, A/B Test, Automated), from name/email
  2. **Audience** — Select list/segment, estimated recipients counter
  3. **Content** — Subject line with emoji picker, preview text, template selector (thumbnail grid)
  4. **Schedule** — Send now vs schedule (datetime picker), timezone selector
  5. **Review** — Summary of all choices with "Send Campaign" confirmation button
- Progress indicator always visible at top
- Save draft auto-save indicator

**Journeys list (`Journeys.vue`):**
- Table columns matching live app: Name, Journey Status (toggle), Contacts, Active Contacts, Items, Created At, Updated At, Actions
- **Journey Status is an inline `v-switch` toggle** — active = blue ON, inactive = grey OFF — users flip it directly in the row without opening the journey. Preserve this exact pattern.
- Actions column: kebab menu (⋮) + refresh icon button
- 81 journeys expected — paginated, 10 per page default
- Primary CTA: "NEW JOURNEY" + "All" status filter dropdown
- Breadcrumb: "My Journeys" above page title

**Journey Builder (`JourneyBuilder.vue`):**
- Canvas-based visual workflow builder
- Drag-and-drop nodes: Trigger, Email, Delay, Condition, Tag, Split
- Each node is a styled `v-card` with icon, label, and connection handles
- Sidebar panel shows node configuration when selected
- Zoom controls, mini-map
- Top toolbar: Journey name (editable inline), Activate toggle, Save button

**Signup Forms / Acquisition Forms:**
- Preview of form in mobile/desktop frame toggle
- Left: element list (fields, buttons, images)
- Right: live preview
- Properties panel (right drawer) when element selected

**Landing Pages:**
- Grid of page cards with thumbnail, name, URL, status, traffic stats
- "Create Page" → opens full-screen editor mode

**Surveys:**
- Question builder with drag-to-reorder
- Question types: Multiple Choice, Short Text, Rating, NPS Scale

**Image Library:**
- Masonry grid of images with hover overlay (copy URL, delete, insert)
- Upload dropzone at top
- Search and filter by tags

### 6. Contacts Section

- **Contact list**: Avatar initial, Full Name, Email, Tags (chips), Last Activity, Source
- Click contact → full contact profile drawer:
  - Header with avatar, name, email, tags
  - Tabs: Overview, Activity Timeline, Campaigns, Orders
  - Activity timeline with icons for each event type
- Segment builder: visual filter builder (field + operator + value rows, AND/OR logic)

### 7. Analytics Section

- Date range selector at top (Last 7, 30, 90 days, custom)
- Tab navigation: Overview, Email, Commerce, Audience
- Each tab has a grid of charts (use recharts, Chart.js, or pure SVG)
- Export button (CSV/PDF) top right

### 8. Settings

The live app uses **horizontal tab navigation + keyword search** — preserve both patterns.

- **Keyword search bar** at top of Settings (searches across all setting labels) — keep this, it's useful
- **Horizontal `v-tabs`** across top (not left-nav): Connections, DNS Setup, Contacts, Campaigns, Store Setup, Others, Service, Channels
- Each tab section uses a **2-column heading + 3-column icon card grid** layout
- Icon cards are clickable tiles with an icon + label — clicking navigates to that sub-settings page

Real sections from live app:
- **Connections**: API Keys, JSON Web Token, Relational Tables, SFTP Access, HTTP Post URL, Conversion Attribution
- **DNS Setup**: Sending Domains, Link Tracking Domains, Brand Management
- **Contacts**: Global Suppression Lists, Bulk Delete Contacts, Cleansing Rules
- **Campaigns**: Test Campaign Subject Line
- **Store Setup**: Region, Account Config, Manage Reasons, Warehouses, Product Categories, Taxes, Packages, Fulfillment Agent, Shipping Settings, Email Templates
- **Others**: 301 Redirects, Custom Domains, Custom Fields, Archives
- **Service**: Reply Templates, Ticket Types, Ticket Tags
- **Channels**: Support Email

---

## 🎨 COMPONENT PATTERNS TO FOLLOW

### Cards
```vue
<v-card flat border rounded="lg" class="pa-6">
  <!-- Always flat (no elevation), always bordered, always rounded-lg -->
</v-card>
```

### Tables
```vue
<v-data-table
  :headers="headers"
  :items="items"
  hover
  :items-per-page="25"
>
  <!-- Use slots for custom cell rendering -->
  <!-- Status columns always use v-chip -->
  <!-- Action columns always use icon buttons in a v-btn-group or menu -->
</v-data-table>
```

### Empty States
Every list/table must have an empty state:
```vue
<div class="d-flex flex-column align-center pa-12 text-center">
  <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-[relevant-icon]</v-icon>
  <p class="text-h6 text-medium-emphasis mb-2">No [items] yet</p>
  <p class="text-body-2 text-medium-emphasis mb-6">Create your first [item] to get started.</p>
  <v-btn color="primary" prepend-icon="mdi-plus">Create [Item]</v-btn>
</div>
```

### Page Headers
```vue
<div class="d-flex align-center justify-space-between mb-6">
  <div>
    <h1 class="text-h5 font-weight-bold">Page Title</h1>
    <p class="text-body-2 text-medium-emphasis mt-1">Short description of what this section does</p>
  </div>
  <v-btn color="primary" prepend-icon="mdi-plus">Primary Action</v-btn>
</div>
```

### Stat Cards
```vue
<v-card flat border rounded="lg" class="pa-5">
  <div class="text-body-2 text-medium-emphasis mb-1">Metric Label</div>
  <div class="text-h4 font-weight-bold mb-2">$12,430</div>
  <v-chip size="small" color="success" variant="tonal">↑ 12.5%</v-chip>
</v-card>
```

### Drawers for Detail Panels (not modal dialogs)
```vue
<v-navigation-drawer v-model="detailDrawer" location="right" width="480" temporary>
  <!-- Detail content -->
</v-navigation-drawer>
```

### Form Layout
- Always use `v-row` / `v-col` grid inside forms
- Labels above inputs (not floating)
- Helper text below inputs for guidance
- Required fields marked with asterisk in label
- Sticky "Save" button in a `v-footer` or at bottom of form

---

## ✅ USABILITY RULES — NEVER BREAK THESE

1. **No full-page navigations for detail views** — use right-side drawers or inline expansion
2. **Every destructive action needs confirmation** — use a small `v-dialog` with "Delete" (red) and "Cancel"
3. **Loading states on every async action** — use `v-skeleton-loader` for initial loads, `v-progress-linear` (indeterminate, top of card) for refreshes
4. **Toasts for all feedback** — use `v-snackbar` (bottom-right, 4s timeout) for success/error/info
5. **Search is always instant** — debounce 300ms, never require pressing Enter
6. **Tables always support sorting** — pass `sortable: true` on every column header
7. **Mobile-responsive** — sidebar collapses on `smAndDown`, tables become card lists on mobile
8. **Keyboard accessible** — all interactive elements reachable via Tab, proper ARIA labels
9. **Consistent icon set** — use only MDI icons (`@mdi/font`), no mixing icon libraries
10. **Never use default Vuetify blue** — always use the custom theme defined above

---

## 🚫 ANTI-PATTERNS TO AVOID

- ❌ No `v-dialog` for detail/edit views that show lots of data — use drawers
- ❌ No inline text editing without a clear save mechanism
- ❌ No tooltips on obvious UI elements
- ❌ No more than 3 levels of navigation depth
- ❌ No `elevation="4"` heavy shadow cards — use `flat border` instead
- ❌ No coloured page backgrounds — keep `#F9FAFB` throughout
- ❌ No icon-only buttons without a `v-tooltip`
- ❌ No wall-of-text descriptions — use short helper text only
- ❌ No horizontal scroll on tables — use column hiding or responsive cards on mobile

---

## 📐 FILE STRUCTURE TO MAINTAIN

Keep the existing structure but enhance it:

```
src/
  components/
    layout/
      AppSidebar.vue       ← redesign nav structure
      AppHeader.vue        ← redesign top bar
      PageHeader.vue       ← NEW: reusable page header component
      StatCard.vue         ← NEW: reusable KPI card
      EmptyState.vue       ← NEW: reusable empty state
      DataTable.vue        ← NEW: wrapper around v-data-table with defaults
    shared/
      ConfirmDialog.vue    ← NEW: reusable delete confirm dialog
      DetailDrawer.vue     ← NEW: reusable right-side detail drawer shell
  views/
    [all existing views — redesign each]
  plugins/
    vuetify.ts             ← update theme here
  styles/
    main.scss              ← global overrides
```

---

## 🚀 HOW TO APPROACH THIS

1. **Start by visiting the live app** (URL above) and spending time in every section
2. **Read all code files** — understand what data is being used and how
3. **Update the Vuetify theme first** — all other work depends on this
4. **Redesign the layout shell** (sidebar + header) — this affects every page
5. **Redesign Dashboard** — this is the first screen merchants see
6. **Work through Commerce, then Marketing, then the rest** — section by section
7. **After each major section, run `npm run dev` and verify visually**
8. **Ask me** if you are unsure about any business logic, merchant workflows, or if you need additional auth credentials/API details

---

## 💬 COMMUNICATION PROTOCOL

- If you need authentication tokens, API endpoint details, or additional credentials → **ask me before proceeding**
- If you are unsure whether a design decision is correct for the merchant's workflow → **ask me**
- After completing each section, **briefly summarise what you changed and why**
- If you find existing code that is broken, incomplete, or inconsistent → **flag it and fix it**

Let's build something merchants will love to use every day. Begin by reading the code and the live app, then present your redesign plan section by section.
