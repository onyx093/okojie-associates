# DESIGN SYSTEM

All values are **estimated from screenshots** (no CSS was available). Use an eyedropper on the live site to refine. Theme: **dark, calm, professional, indigo accent**, generous spacing, large rounded cards.

---

## 1. Design tokens

```css
:root {
    /* Surfaces */
    --bg: #14151f; /* page background (deep navy-charcoal) */
    --bg-elevated: #1c1d2a; /* cards, form panels, header-adjacent sections */
    --bg-sunken: #181925; /* "Best for" boxes, inputs, tab container */
    --bg-raised: #0f1018; /* active tab pill, deeper inset */
    --border: #2a2b3b; /* 1px card & divider borders */
    --border-strong: #3a3c52; /* outlined buttons, input hover */

    /* Text */
    --text: #f4f5fa; /* headings, primary */
    --text-body: #d3d5e2; /* paragraphs */
    --text-muted: #a3a6ba; /* helper text, footer, placeholder */

    /* Accent (indigo / periwinkle) */
    --accent: #4f63e8; /* primary buttons, logo disc, links, icons, price ranges */
    --accent-hover: #6075f0;
    --accent-press: #3f51cf;
    --accent-soft: rgba(79, 99, 232, 0.14); /* icon tiles, badges */

    /* Status */
    --success: #3ecf8e;
    --warning: #f5b942;
    --danger: #ef5b5b;
    --star: #5b6cf0; /* testimonial stars appear indigo-ish */

    /* Shape */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 18px; /* cards */
    --radius-xl: 24px; /* big panels, hero image */
    --radius-pill: 999px; /* buttons, inputs in footer, badges, tabs */

    /* Layout */
    --container: 1160px;
    --gutter: 24px;
    --section-y: 96px; /* vertical padding between major sections */

    /* Shadows (very subtle on dark) */
    --shadow-card:
        0 1px 0 rgba(255, 255, 255, 0.03) inset, 0 8px 24px rgba(0, 0, 0, 0.25);
}
```

### 1a. Tailwind CSS v4 + shadcn/ui mapping

Tailwind v4 is **CSS-first**: there is no `tailwind.config.js`. Define tokens in `resources/css/app.css`. The app is **dark-only**, so put the palette directly in `:root` (and add `class="dark"` / `color-scheme: dark` on `<html>`).

```css
@import 'tailwindcss';

:root {
    color-scheme: dark;

    /* shadcn/ui variables → our palette */
    --background: #14151f;
    --foreground: #f4f5fa;
    --card: #1c1d2a;
    --card-foreground: #f4f5fa;
    --popover: #1c1d2a;
    --popover-foreground: #f4f5fa;
    --primary: #4f63e8; /* brand indigo */
    --primary-foreground: #ffffff;
    --secondary: #181925; /* sunken surfaces, tab container */
    --secondary-foreground: #f4f5fa;
    --muted: #181925;
    --muted-foreground: #a3a6ba;
    --accent: #232436; /* shadcn "accent" = subtle hover surface (NOT brand) */
    --accent-foreground: #f4f5fa;
    --destructive: #ef5b5b;
    --border: #2a2b3b;
    --input: #3a3c52;
    --ring: #4f63e8;
    --radius: 0.75rem; /* 12px base */

    /* extras from §1 */
    --brand-hover: #6075f0;
    --brand-press: #3f51cf;
    --brand-soft: rgb(79 99 232 / 0.14);
    --text-body: #d3d5e2;
    --raised: #0f1018;
    --success: #3ecf8e;
    --warning: #f5b942;
}

@theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-brand-hover: var(--brand-hover);
    --color-brand-soft: var(--brand-soft);
    --color-body: var(--text-body);
    --color-raised: var(--raised);
    --color-success: var(--success);
    --color-warning: var(--warning);

    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 18px; /* cards */
    --radius-xl: 24px; /* big panels, banners */
    --radius-pill: 999px;

    --font-sans:
        'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto,
        sans-serif;
    --font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;

    --container-site: 1160px; /* usable as max-w-site */
    --tracking-display: -0.035em;
    --tracking-heading: -0.03em;
}

@layer base {
    * {
        @apply border-border;
    }
    body {
        @apply bg-background text-foreground font-sans antialiased;
    }
    h1,
    h2,
    h3 {
        letter-spacing: var(--tracking-heading);
    }
}
```

**Usage notes**

- Use utilities like `bg-card`, `text-muted-foreground`, `border-border`, `rounded-lg` (=18px card), `rounded-[var(--radius-pill)]` / `rounded-full` for pills, `max-w-site`.
- Brand-colored UI uses `primary` (`bg-primary`, `text-primary`, `ring-ring`). Do **not** map the brand to shadcn's `--accent`; in shadcn that variable is the neutral hover surface.
- Ranges/price text: `text-primary`; icon tiles: `bg-[--brand-soft]` (or `bg-primary/15`).
- Fonts: load Inter (self-hosted via `@fontsource-variable/inter` or the Laravel Vite font preload) — avoid render-blocking third-party CSS.

### 1b. shadcn/ui component map

| UI element                                    | shadcn component (installed with the CLI)                                                               | Customization                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Buttons (primary, outline, ghost)             | `button`                                                                                                | add `pill` size/radius (`rounded-full`), height 44–48px, `w-full` variant |
| Text inputs, textarea                         | `input`, `textarea`, `label`                                                                            | 44px height, `bg-secondary`, 12px radius; footer newsletter input pill    |
| Selects (tier, time window, format, doc type) | `select`                                                                                                | compact width; chevron-down                                               |
| Cards (tiers, forms, portal panels, offices)  | `card`                                                                                                  | `rounded-lg` (18px), padding 28–32px                                      |
| Pills / status chips / tier badge             | `badge`                                                                                                 | tinted variants (warning/primary/success/muted)                           |
| FAQ                                           | `accordion` (`type="multiple"`)                                                                         | row dividers, rotating chevron                                            |
| Testimonial slider                            | `carousel` (Embla)                                                                                      | prev/next as 36px outlined circles                                        |
| Video modal                                   | `dialog`                                                                                                | 16:9 container                                                            |
| Mobile nav                                    | `sheet`                                                                                                 | right drawer                                                              |
| Toasts                                        | `sonner`                                                                                                | flash → toast bridge                                                      |
| Add-on table, admin tables                    | `table`                                                                                                 | rounded bordered wrapper                                                  |
| Upload progress                               | `progress`                                                                                              | indigo bar                                                                |
| MFA code                                      | `input-otp`                                                                                             | 6 slots                                                                   |
| Dividers                                      | `separator`                                                                                             |                                                                           |
| Loading                                       | `skeleton`                                                                                              |                                                                           |
| Portal tabs                                   | custom component built from Inertia `<Link>` + Tailwind (shadcn `tabs` is state-based, not route-based) | segmented control per §4                                                  |
| Icons                                         | `lucide-react`                                                                                          | 1.5px stroke                                                              |

---

## 2. Typography

- **Font family:** Inter (or Inter Tight for headings) with system fallbacks: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Mono (referral link):** `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.
- Headings have **tight negative tracking** (≈ −0.03em) and heavy weight (600–700); this is a distinctive trait.

| Role                                        | Size (desktop)                               | Weight  | Line height | Tracking          |
| ------------------------------------------- | -------------------------------------------- | ------- | ----------- | ----------------- |
| Display / H1 (hero)                         | 56–64px                                      | 700     | 1.05–1.1    | −0.035em          |
| Page H1 (Services, Pricing, Contact, About) | 48px                                         | 700     | 1.1         | −0.03em           |
| H2 (section)                                | 36–40px                                      | 700     | 1.15        | −0.03em           |
| H3 card title                               | 20–22px                                      | 600     | 1.25        | −0.02em           |
| Portal page title (email)                   | 32px                                         | 700     | 1.1         | −0.03em           |
| Body large (hero sub)                       | 18–20px                                      | 400     | 1.6         | 0                 |
| Body                                        | 16px                                         | 400     | 1.6         | 0                 |
| Small / helper                              | 14px                                         | 400–500 | 1.5         | 0                 |
| Eyebrow ("NEXT STEP", "STEP 1")             | 12px                                         | 600     | 1.2         | +0.06em uppercase |
| Stat number                                 | 40–48px                                      | 700     | 1           | −0.03em           |
| Price                                       | 28–32px (range), "starting at" 12–13px muted | 700     | 1           | −0.02em           |

Mobile: H1 40px, H2 30px, body 16px.

---

## 3. Layout & spacing

- 8px base grid. Common gaps: 8, 12, 16, 24, 32, 48, 64, 96.
- Container max 1160px, centered; side padding 24px (16px on mobile).
- Section rhythm: ~96px vertical padding; sections separated by 1px `--border` full-bleed rules.
- Grids:
    - Tier cards: 3 columns, gap 24px → 1 column < 900px.
    - Offices: 4 cols → 2 cols < 1000px → 1 col < 600px.
    - Security cards (About): 4 cols → 2 → 1.
    - Stats: 3 or 4 columns, left-aligned (About) / centered (Home strip).
    - Portal: 2-column (left form card wider than right list, ≈ 5/7 vs 7/5 depending on tab; Overview 2/3 + 1/3 with invoice above two stat tiles).
    - Add-on cards (Pricing): 2 columns, centered, max ≈ 800px.

---

## 4. Components

### Buttons

- **Primary:** bg `--accent`, white text 600, height 44–48px, padding 0 24px, radius pill, hover `--accent-hover`; full-width variant in cards/forms.
- **Secondary / outline:** transparent, 1px `--border-strong`, white text, pill (e.g. "Book a Free Consultation", "Sign out", "Refer someone now").
- **Ghost / text link:** no bg, `--text-body`, hover white (nav links, "My Portal", "Client Login").
- **Small compact:** "Subscribe", "Copy" (outlined pill with icon).
- Icon buttons in portal buttons: icon (calendar-plus, send, credit-card) at left, 16–18px, gap 8px.
- Focus: `outline: 2px solid var(--accent); outline-offset: 2px`.

### Inputs

- Height 44px; bg `--bg-sunken`/transparent; 1px `--border`; radius 12px (forms) or pill (footer newsletter); padding 0 14px; placeholder `--text-muted`; focus border `--accent` + soft ring.
- Textarea min-height 80px, resizable vertically (resize handle visible).
- Select: custom chevron-down icon right; compact width (fits content) in forms.
- Labels: 14px 600 `--text`, 6px above field. (Login card has no visible labels.)
- Date input: native.

### Card

- bg `--bg-elevated`, 1px `--border`, radius 18px, padding 28–32px. Hover (tier/offices): border lightens slightly.
- "Best for" callout inside tier card: bg `--bg-sunken`, radius 12px, padding 12–14px, 13px text, label "Best for:" bold.

### Badge / pill

- Hero pill: small, border 1px, bg `--accent-soft`, text 13px, with dot/map-pin; e.g. "26+ years · Philadelphia & Baltimore".
- Tier badge in portal: tiny pill, bg `--bg-elevated`, 12px, "No tier selected".
- Status chips (appointments/docs): 12px, pill, soft tinted bg (Requested=warning, Confirmed=accent, Completed=success, Cancelled=muted).

### Logo

- 32px circle `--accent` with white bold "O". Wordmark "Okojie & Associates, Inc." 16px 600 white; sub-label "Okojie Online" 11–12px muted beneath (header only).

### Icons

- Line icons, 1.5px stroke, accent color inside cards: shield-check, lock, key-round, file-check/signature, map-pin, phone, mail, clock, check, chevron-down, play, cloud-upload, gift, file-text, credit-card, send, copy, calendar-plus, arrow-left/right, users/link. Use **lucide-react**.

### Accordion (FAQ)

- Rows separated by 1px border; question 16–17px 600; chevron-down muted right; padding 20px 0; answer 15–16px `--text-body`, max-width ~700px.

### Tabs (portal)

- Container: bg `--bg-sunken`, 1px border, radius pill, padding 4px, inline-flex.
- Tab: padding 8px 14px, 14px 600, muted text; **active:** bg `--bg-raised`, white text, radius pill, subtle inner border.

### Stepper (portal Overview)

- Vertical list, 36px row height. Marker: 20px circle; completed = 2px accent ring + check icon accent; pending = 2px `--border-strong` ring. Label 16px (completed 600 white; pending `--text-body`).
- Below: "NEXT STEP" box — bg `--bg-sunken`, 1px border, radius 14px, padding 16px; eyebrow label + sentence.

### Stat tile (portal)

- Card with 24px accent icon top-left, large number (32px 700), label 14px muted below.

### Drop zone

- Dashed 1px `--border-strong`, radius 14px, min-height 160px, centered cloud-upload icon (accent), title 15px 600, helper 13px muted. Hover/drag-over: border accent + `--accent-soft` bg.

### Video card

- 16:9 thumbnail (dark blue gradient/photo) radius 14px top; centered 56px circular play button (accent bg, white triangle); below: title 17px 600, description 14px muted. Card bg `--bg-elevated`, border, radius 18px.

### Testimonial card

- 5 star icons (accent), quote 16px, then name (600) + location (muted 14px). Card equal heights. Round 36px arrow buttons (outlined) vertically centered at left/right of the track.

### Hero

- Full-bleed photo (city skyline at dusk, warm window lights), overlay gradient `linear-gradient(180deg, rgba(20,21,31,.75), rgba(20,21,31,.92))`. Content centered, max-width 760px. Height ≈ 520–560px.
- About hero is **text-only** then a **rounded (24px) full-width photo** banner (aspect ≈ 3:1.1).

---

## 5. Motion

- **Scroll reveal:** opacity 0→1, translateY 16px→0, 500–600ms ease-out, stagger 60–80ms per card. Triggered at 15% visible, once.
- **Hover:** buttons brighten (150ms); cards border-color transition (150ms).
- **Accordion:** height auto transition 200ms; chevron rotate 180°.
- **Carousel:** smooth scroll-snap.
- Respect `prefers-reduced-motion: reduce` → no transforms/fades.

---

## 6. Responsive rules

| Breakpoint | Behavior                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ≥1200      | As screenshots                                                                                                                  |
| 900–1199   | Container 100% − 48px; tier grid stays 3 col until 900                                                                          |
| 600–899    | Nav → hamburger drawer; tier cards stack; offices 2-col; portal two-column forms stack (form first, list below); stat strip 2×2 |
| <600       | Single column; hero H1 40px; buttons full-width; footer columns stack; testimonials show 1 card with arrows                     |

Header mobile drawer: logo left, hamburger right; links stacked; auth actions at bottom.

---

## 7. Imagery

- **Hero (Home):** moody city skyline at dusk seen through office windows (dark with warm lights). Source your own licensed/AI-generated image; keep it dark.
- **About banner:** four diverse professionals around a table reviewing documents, laptop and calculator. Use your own photos.
- **Video thumbnails:** dark-blue laptop-at-night shots (How-to), portrait of a smiling woman at a desk (client stories). Placeholders acceptable.
- Add `alt` text to all images; set explicit `width`/`height` on `<img>` to prevent layout shift, use `loading="lazy"` below the fold, `fetchpriority="high"` on the hero image, and serve WebP/AVIF.

---

## 8. Page layout blueprints (desktop)

**Home:** Header → Hero (badge, H1, sub, 2 CTAs, trust row) → Stats strip (4) → Three ways to file → How it works (5 cards) → What clients say → Watch & Learn (3 groups × 2) → Find us in person (4) → Referral banner (2 col) → Quote form panel (2 col) → FAQ → Footer.

**Services:** Header → H1+sub → 3 tier cards → Add-ons (table in rounded bordered container) → "Not sure which tier fits?" panel → FAQ → Footer.

**Pricing:** Header → H1+sub → 3 tier cards → Add-ons (card grid) → "Pricing questions" FAQ → Footer.

**About:** Header → H1+paragraph → rounded photo → 3 stats → "Your data is protected" (4 cards) → "Find us in person" (4) → Footer.

**Contact:** Header → H1+sub → 3 small info cards (centered row) → "Start My Return Online" panel (left copy / right form) → "Book a free consultation" narrow centered card (~640px) → "Find us in person" (4) → Footer.

**Login/Register:** Header (guest variant) → centered 400px card → helper line → Footer.

**Portal:** Header (authed variant) → "Welcome back" + email + tier badge → Tabs → tab content (cards) → Footer.
