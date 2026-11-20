# Design System & Visual Specification
## JurisNova AI — "Green To Heart" Enterprise Visual Language

**Reference Website Inspiration:** Hemla HR Dashboard Template (`demo.codeandchill.store/hemla/overview`)  
**Theme:** Calm Earth Emerald / "Green To Heart"

---

## 1. Color Palette Tokens

### Brand Palette (Emerald Range)
* **Mint Green:** `#86FAAF` — Used for high-priority badges, active nav pills, and subtle border highlights.
* **Bright Green:** `#30ED7B` — Primary accent for glowing indicators, data points, and active pulse dots.
* **Emerald:** `#00D765` — Core brand anchor for gradient buttons, chart areas, and verified checkmarks.
* **Deep Emerald:** `#00B369` — Medium surface fills and table header borders.
* **Forest Emerald:** `#00875F` — Dark badge backdrops, subtle card tints, and button focus rings.

### Primary Gradients
* **Primary Emerald Gradient:**
  `linear-gradient(135deg, #86FAAF 0%, #30ED7B 25%, #00D765 50%, #00B369 75%, #00875F 100%)`
* **Secondary Gradient:**
  `linear-gradient(135deg, #30ED7B 0%, #00D765 45%, #00875F 100%)`
* **Card Gradient (Subtle):**
  `linear-gradient(180deg, rgba(16, 37, 28, 0.6) 0%, rgba(13, 33, 25, 0.9) 100%)`

### Dark Theme Tokens (Default)
* **Primary Background:** `#07140F` (Deep obsidian forest)
* **Secondary Background:** `#0A1D16` (Sidebar & navigation chrome)
* **Elevated Surfaces:** `#10251C` (Inner nested containers, input boxes)
* **Card Backgrounds:** `#0D2119` (Metric cards, finding panels)
* **Border Color:** `rgba(134, 250, 175, 0.13)` (Refined translucent mint stroke)
* **Text Primary:** `#F5FAF6` (High-contrast clean white-green)
* **Text Secondary:** `#A3B8AC` (Readable muted green-gray)

### Light Theme Tokens
* **Background:** `#F5FAF6` (Soft sage white)
* **Cards & Surfaces:** `#FFFFFF` (Pure white)
* **Elevated Surfaces:** `#EBF4EE` (Subtle tinted sage)
* **Text Primary:** `#13251B` (Deep forest ink)
* **Text Secondary:** `#617267` (Medium slate sage)
* **Borders:** `#DFEAE1` (Light crisp border stroke)
* **Accent Color:** `#00875F` (Forest emerald for strong light contrast)

---

## 2. Typography

* **Primary Font Family:** `Inter`, `Geist`, `system-ui`, `sans-serif`
* **Monospace Font Family:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `monospace` (Used for requirement codes, token counts, and audit hashes)
* **Scale & Hierarchy:**
  * **Hero Headline:** 48px – 72px / Bold 800 / Tracking -0.025em
  * **Page Heading (H1):** 24px / Bold 700 / Tracking -0.02em
  * **Section Heading (H2):** 16px – 18px / Bold 700
  * **Card Title (H3):** 13px – 14px / Bold 600
  * **Body Text:** 12px – 13px / Regular 400 / Leading 1.6
  * **Caption & Meta:** 10px – 11px / Medium 500 / Uppercase where appropriate

---

## 3. UI Component Standards

### 1. Metric KPI Cards
* Rounded corners: `rounded-xl` (12px)
* Border: 1px `border-[var(--border-color)]`
* Subtle hover transition: `hover:border-brand-mint/30`
* Icon badge: 32x32px square with `rounded-lg` and 20% emerald opacity background.

### 2. Status Badges
* **Implemented:** `bg-brand-forest/30 text-brand-mint border border-brand-mint/30`
* **Partially Implemented:** `bg-yellow-500/20 text-yellow-300 border border-yellow-500/30`
* **Missing:** `bg-red-500/20 text-red-300 border border-red-500/30`
* **Pending Human Review:** `bg-amber-500/10 text-amber-400 border border-amber-500/20`
* **Approved:** `bg-emerald-950/40 text-emerald-400 border border-emerald-500/20`

### 3. Risk Heatmap 5x5 Matrix
* **Critical (17–25):** Red `#EF4444`
* **High (10–16):** Orange `#F97316`
* **Moderate (5–9):** Yellow `#EAB308`
* **Low (1–4):** Mint Green `#30ED7B`

---

## 4. Accessibility & Micro-Interactions

* **WCAG 2.1 AA:** Minimum 4.5:1 text-to-background contrast ratio maintained across dark and light themes.
* **Glow Effects:** Restrained emerald glows (`shadow-glow-sm`: `0 0 15px rgba(48, 237, 123, 0.15)`) applied only to primary CTAs and active indicators. Excessive neon glows are intentionally avoided.
* **Motion:** Subtle 150ms–250ms ease transitions on interactive elements.
