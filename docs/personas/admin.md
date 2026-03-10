# Persona: Platform Admin

## Profile
- **Name:** David Okonkwo
- **Role:** Operations Manager / IT Admin for a multi-brand retail company
- **Age:** 42
- **Tech comfort:** Very high — manages APIs, DNS, integrations, user permissions
- **Manages:** 3 Maropost accounts (one per brand), 12 team members
- **Time in Maropost:** 2–5 hours/week (mostly settings and troubleshooting)

## Weekly Tasks in Maropost (by frequency)

1. **User management** — onboard/offboard team members, adjust permissions (weekly)
2. **Integration monitoring** — check API connections, webhook health, SFTP syncs (weekly)
3. **DNS and domain setup** — configure sending domains, tracking domains, brand management (as needed)
4. **Billing review** — check plan usage, email volume, overages (monthly)
5. **Settings configuration** — store setup (taxes, shipping, warehouses), campaign settings (monthly)
6. **Troubleshooting** — investigate delivery issues via Log Inspector, check suppression lists (as needed)
7. **API key management** — rotate keys, issue tokens for integrations (as needed)

## Key Pages Used

| Page | Frequency | What he does |
|------|-----------|--------------|
| Settings | Weekly | All sub-sections — Connections, DNS, Store Setup |
| Users | Weekly | Add/remove team members, set roles |
| Integrations | Weekly | Monitor connected services health |
| Log Inspector | As needed | Debug email delivery issues |
| Billing | Monthly | Review usage and costs |
| Secure Lists | As needed | Manage suppression/blocklists |

## Pain Points

1. **Settings are scattered** — has to remember which tab each setting lives under. Keyword search helps but doesn't show the full picture
2. **No audit log** — can't see who changed what setting or when
3. **User roles are too broad** — wants granular permissions (e.g., "can create campaigns but not send them")
4. **Integration status is binary** — just connected/not connected. Wants to see last sync time, error count, data volume
5. **Multi-account management** — has to log out and log back in to switch between brand accounts. Wants an account switcher
6. **API documentation is external** — wants in-app API reference or at least links from the Settings > API Keys page
7. **No environment staging** — changes go live immediately, no preview/sandbox mode for settings

## Success Metrics
- Zero downtime on integrations
- Email deliverability > 98%
- All team members have correct access levels
- DNS health checks passing
- API keys rotated every 90 days

## Interface Expectations
- Settings organized by function, not by arbitrary tabs
- Search that works across all settings with results highlighting
- Integration health dashboard with last sync time, error rates
- User management with role-based access control matrix
- Audit trail for all settings changes
- Quick links to API docs from relevant settings pages
- Account switcher in the sidebar (already partially implemented)

## Quote
> "I'm the one who gets paged at 2am when an integration breaks. Give me clear status indicators, good logging, and the ability to fix things without navigating through 10 pages."
