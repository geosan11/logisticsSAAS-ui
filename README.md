# logisticsSAAS — Presentational UI Shell

Modern, high-density freight operations terminal built for counter clerks and station managers using rugged Panasonic Toughbook CF-31 tablets (1024×768 landscape) and desktop browsers.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6 (`@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (No PostCSS required)
- **Icons**: `lucide-react`
- **Typography**: Inter via local `@fontsource/inter` (100% offline-ready, no Google Fonts dependency)
- **Data & State**: In-memory state router with URL deep linking (`?screen=...`) and local mock data

---

## Panasonic CF-31 Counter Optimizations (1024×768)

- **Zero Horizontal Overflow**: Guaranteed `document.documentElement.scrollWidth <= 1024` on all views.
- **Collapsible Navigation Rail**: Compact icon rail (64px) preserves usable counter screen width; expands to 220px when clicked.
- **Rugged Touch Targets**: Counter intake and EOD reconciliation forms enforce minimum 44px tap targets for stylus/gloved fingers.
- **IATA Volumetric Engine**: Pure calculation helper computes `(L × W × H in cm) / 6000`, rounding up to the next 0.5 kg (standard express freight rule).
- **Nigerian Currency**: Standardized `en-NG` NGN (`₦`) currency and `tabular-nums` alignment across all pricing and denomination registers.

---

## Replit Import & Quick Start

This project is configured out-of-the-box for **Replit**:
- Port: `5000` (mapped to external port `80` in `.replit`)
- Host: `0.0.0.0`
- `allowedHosts: true` set under both `server` and `preview` in `vite.config.ts`.
- `.replit` contains `run = "npm run dev"` and `modules = ["nodejs-20"]`.

### Local / Replit Commands

```bash
# Install dependencies
npm install

# Start development server on port 5000
npm run dev

# Run TypeScript type check
npm run typecheck

# Production build
npm run build

# Preview build locally
npm run preview

# Verify 1024x768 viewport screenshots and assert zero horizontal overflow
npm run screenshot
```

---

## Screen Directory & Deep-Link Parameters

You can link directly to any screen or test state using URL query parameters:

| URL Query | Description |
|---|---|
| `?screen=login` | Terminal Sign-in (PIN / Email) |
| `?screen=login-error` | Sign-in with simulated auth failure banner |
| `?screen=tenant` | Multi-Tenant Workspace Selector |
| `?screen=tenant-suspended` | Tenant gate with suspended operator audit notice |
| `?screen=dashboard` | Command Center Live Stream & Hub Status Cards |
| `?screen=intake` | Fast Counter Intake (Keyboard-First, IATA engine) |
| `?screen=intake-error` | Fast Intake with validation errors highlighted |
| `?screen=eod` | End-of-Day Reconciliation & ₦ Denomination Counter |
| `?screen=eod-modal` | EOD with Supervisor PIN confirmation modal open |

---

## Project Structure

```
/workspace/logisticsSAAS-ui/
├── .replit                       # Replit run configuration
├── index.html                    # Dark canvas container (#09090b)
├── package.json                  # React 19, Tailwind v4, Lucide
├── tsconfig.json                 # Strict TypeScript configuration
├── vite.config.ts                # Tailwind v4 plugin + 0.0.0.0:5000 config
├── scripts/
│   └── screenshot.cjs            # Playwright 1024x768 overflow verification
├── screenshots/                  # 1024x768 PNG captures
│   ├── 01-login.png
│   ├── 02-tenant-gate.png
│   ├── 03-dashboard.png
│   ├── 04-fast-intake.png
│   ├── 05-eod-reconciliation.png
│   ├── 06-appshell-expanded.png
│   ├── 07-login-error.png
│   ├── 08-tenant-suspended.png
│   ├── 09-intake-validation-error.png
│   └── 10-eod-confirm-modal.png
└── src/
    ├── App.tsx                   # In-memory deep-linked router
    ├── index.css                 # Tailwind v4 theme & scrollbar rules
    ├── main.tsx                  # Font loading & root render
    ├── types/                    # Domain definitions
    ├── lib/
    │   ├── calc.ts               # IATA volumetric & chargeable weight rules
    │   └── format.ts             # NGN currency & weight formatters
    ├── mock/
    │   └── data.ts               # Nigerian hubs, manifests, denominations
    └── components/
        ├── AppShell.tsx          # Collapsible rail & top operations bar
        ├── CommandCenterDashboard.tsx # High-density KPI strip & manifest stream
        ├── FastCounterIntake.tsx # Keyboard-first single-screen intake
        ├── EodReconciliationView.tsx  # Physical cash counter & closeout modal
        ├── TenantGate.tsx        # Tenant selector & suspended alert
        └── LoginScreen.tsx       # Counter terminal sign-in
```
