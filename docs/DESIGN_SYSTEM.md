# DESIGN SYSTEM (v2 — "Redesign 2026")

**Supersedes** the v1 dark-only, Inter, pill-button, tab-portal design system (archived in `_archive/DESIGN_SYSTEM.v1-dark-only.md`).

**Source of truth:** the static mockups in `frontend/mockups/` (31 screens + `index.html`) and the shared CSS they load (`shared/tokens.css`, `app.css`, `site.css`, `auth.css`) plus the already-React home components in `frontend/resources/js/components/home/`.
**Precedence:** mockup HTML/CSS > this document > anything in v1 docs. Where this file and a mockup disagree, follow the mockup and fix this file.

**Stack (unchanged):** Laravel 13 · Inertia v3 · React 19 · Tailwind CSS v4 · shadcn/ui. Nothing in the design requires changing it.

---

## 0. What changed from v1

| Area                 | v1 (old)                           | v2 (new)                                                                                                                                                           |
| -------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Theme                | Dark only                          | **Light + dark**, user-switchable (Light / Dark / System)                                                                                                          |
| Fonts                | Inter                              | **Geist** (sans) + **Geist Mono** (eyebrows, nav links, OTP, codes)                                                                                                |
| Surfaces             | One card (18px radius, 1px border) | **Two-layer card**: grey _shell_ (20px) with a title row + white _inner_ (14px) with content                                                                       |
| Buttons              | Full pill                          | 11px-radius buttons with layered inset/glow shadows; pills only for chips                                                                                          |
| Page chrome (public) | Photo hero + simple header         | **Sky-gradient "band"** header with floating nav, mono uppercase links; the Home hero may carry a decorative photo layer under the sky veil (D-08)                 |
| Page chrome (auth)   | Centered card                      | **Split screen**: form left, atmospheric art panel right                                                                                                           |
| Page chrome (portal) | Top header + segmented tabs        | **Sidebar app shell** (248px) with grouped nav, counts, help card, profile; off-canvas on mobile                                                                   |
| Admin                | Basic tables in cards              | Same sidebar shell, metrics strip, toolbars, filters, pagers, dialogs                                                                                              |
| Footer               | Three columns on page bg           | **Rounded card footer** with four columns and legal links                                                                                                          |
| New screens          | —                                  | Receipt, Review & e-sign, Confirm password, Verify email, Settings (profile/security/appearance), Legal ×3, Error (404/419/500/503), tier finder, comparison table |

---

## 1. Principles

1. **Quiet and trustworthy.** Soft stepped greys (never pure black in dark), one indigo accent, generous whitespace.
2. **Two-layer depth.** Content sits in a white inner card on a tinted shell; depth comes from 1px rings + layered soft shadows, not heavy borders.
3. **Mono as signal.** Geist Mono, uppercase, wide tracking marks eyebrows and nav labels.
4. **Atmosphere only where it earns it.** Sky gradients appear on the public header band, the closing CTA band, and the auth art panel — never inside the portal/admin.
5. **Every state designed.** Empty, loading/scanning, locked, error, success, and each return stage have explicit designs (see `UI-STATE-MATRIX.md`).
6. **Accessible by default.** Skip link, `:focus-visible` outline, labelled regions, `aria-current`, `role="status"/"alert"`, reduced-motion support.

---

## 2. Design tokens

Values are taken from `shared/tokens.css`. These are the canonical numbers; use them verbatim.

### 2.1 Color

| Role                                    | Light                                    | Dark                                 |
| --------------------------------------- | ---------------------------------------- | ------------------------------------ |
| Page canvas (`bg`)                      | `#F5F6F8`                                | `#09090C`                            |
| Shell (outer card layer, sidebar)       | `#EFF0F3`                                | `#0E0E12`                            |
| Surface (inner cards, inputs' focus bg) | `#FFFFFF`                                | `#121217`                            |
| Surface sunken (inputs, wells, hover)   | `#F4F5F7`                                | `#1A1A21`                            |
| Border                                  | `rgb(16 19 40 / .07)`                    | `rgb(255 255 255 / .07)`             |
| Border strong                           | `rgb(16 19 40 / .13)`                    | `rgb(255 255 255 / .12)`             |
| Text primary                            | `#0E1020`                                | `#F2F3F7`                            |
| Text secondary                          | `#4B5066`                                | `#A6A9BA`                            |
| Text tertiary                           | `#7E8398`                                | `#6F7286`                            |
| Accent solid                            | `#4F63E8`                                | `#5E70F0`                            |
| Accent solid hover                      | `#4253D6`                                | `#7181F4`                            |
| Accent soft (tints)                     | `#EEF0FE`                                | `rgb(110 126 245 / .15)`             |
| Accent text                             | `#3446C9`                                | `#A8B2FF`                            |
| On accent                               | `#FFFFFF`                                | `#FFFFFF`                            |
| Success text / soft                     | `#127A49` / `#E7F6EE`                    | `#5BD49A` / `rgb(60 200 130 / .12)`  |
| Warning text / soft                     | `#A65A0B` / `#FDF1E2`                    | `#F2B266` / `rgb(240 160 70 / .13)`  |
| Danger text / soft                      | `#B9322A` / `#FCEBEA`                    | `#FF8A80` / `rgb(255 110 100 / .12)` |
| Rose tile (metrics)                     | bg `rgb(232 90 140 / .12)`, fg `#C2416F` | fg `#F58BB2`                         |
| Overlay (scrim)                         | `rgb(14 16 32 / .32)`                    | `rgb(0 0 0 / .55)`                   |

> **D-01 (approved, option 2): the near-black palette is the dark theme everywhere.** Canvas `#09090C`, surface `#121217` and tertiary text `#6F7286` come from `home.css`; the **shell** (`#0E0E12`) and **sunken** (`#1A1A21`) layers are derived because `home.css` has no two-layer cards. Accent, status colors, borders (.07/.12) and shadows are unchanged. Tertiary text on these surfaces is ≈ 3.9:1 — if axe flags it (UI-37), lighten `--fg-3` (e.g. `#8A8DA0`) and log the change.

### 2.2 Shadows (theme-dependent)

| Token           | Light                                                                                                 | Dark                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `card`          | `0 0 0 1px rgb(16 19 40/.05), 0 1px 2px rgb(16 19 40/.04), 0 6px 16px -10px rgb(16 19 40/.10)`        | `0 0 0 1px rgb(255 255 255/.05), inset 0 1px 0 rgb(255 255 255/.03), 0 8px 24px -14px rgb(0 0 0/.6)`   |
| `raised`        | `0 0 0 1px rgb(16 19 40/.06), 0 2px 4px rgb(16 19 40/.04), 0 18px 44px -16px rgb(16 19 40/.22)`       | `0 0 0 1px rgb(255 255 255/.08), inset 0 1px 0 rgb(255 255 255/.05), 0 24px 60px -20px rgb(0 0 0/.85)` |
| `chip`          | `0 0 0 1px rgb(16 19 40/.07), 0 1px 2px rgb(16 19 40/.06), 0 4px 10px -4px rgb(16 19 40/.10)`         | `0 0 0 1px rgb(255 255 255/.08), inset 0 1px 0 rgb(255 255 255/.05), 0 6px 14px -6px rgb(0 0 0/.6)`    |
| `btn` (primary) | `inset 0 1px 0 rgb(255 255 255/.22), 0 1px 2px rgb(30 40 140/.3), 0 6px 16px -6px rgb(79 99 232/.55)` | `inset 0 1px 0 rgb(255 255 255/.2), 0 1px 2px rgb(0 0 0/.4), 0 8px 24px -8px rgb(94 112 240/.6)`       |

### 2.3 Radii

`xs 7px · sm 10px · md 14px · lg 20px · xl 24px`, plus band/footer **28px** (22px on phones), chips/avatars **999px**.
Named roles used by components: **control 10px** (inputs, selects, search, filter), **btn 11px**, **inner 14px**, **card/shell 20px**, **panel 24px** (auth art), **band 28px**.

### 2.4 Typography

- Sans: **Geist** 400/500/600. Mono: **Geist Mono** 400/500. Headings default to **weight 500**, `letter-spacing: -0.02em`, `text-wrap: balance`; paragraphs `text-wrap: pretty`.
- Base size: **15px** in app/auth, **16px** on public pages. Line-height 1.5. Antialiased. `font-variant-numeric: tabular-nums` for numbers (`.num`).

| Role              | Spec                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Public band H1    | `clamp(40px, 5.6vw, 68px)`, lh 1, tracking −0.04em; `<em>` portion in accent text, not italic |
| Public section H2 | `clamp(32px, 4vw, 48px)`, lh 1.05, tracking −0.035em, max-w 16ch (22ch centered)              |
| CTA band H2       | `clamp(34px, 4.6vw, 56px)`, lh 1.02, tracking −0.04em, max-w 18ch                             |
| Auth H1           | 32px (28px < 960), lh 1.1, tracking −0.035em                                                  |
| App page H1       | 28px (24px < 640), lh 1.15, tracking −0.03em                                                  |
| Lead paragraph    | 18px on band, 16.5px sections, 15px auth; secondary color                                     |
| Shell head H2     | 15px / 500 / −0.01em, optional 18px leading icon in tertiary color                            |
| Eyebrow           | mono 11px / 500 / +0.07em / uppercase / tertiary                                              |
| Chip-eyebrow      | mono 11.5px / 500 / +0.06em / uppercase in a surface chip with a dark 18px glyph tile         |
| Nav links (site)  | mono 12px / +0.06em / uppercase                                                               |
| Metric value      | 26px / 500 / −0.03em (`sm` 18px)                                                              |
| Amount (invoice)  | 34px / 500 / −0.035em (muted variant 22px)                                                    |
| Body small        | 13.5–14px; hints 12.5px tertiary                                                              |

### 2.5 Motion

- Easing `--ease-out: cubic-bezier(.22, 1, .36, 1)`.
- Buttons: bg/shadow 150ms; `active:scale-[.97]` (icon buttons `.95`) 200ms with ease-out.
- Sidebar drawer: translate 280ms ease-out; scrim opacity 200ms.
- FAQ plus icon: rotate 45° over 250ms ease-out.
- Stepper fill width 400ms ease-out; toggle thumb translate 200ms.
- **Theme switching:** add class `theme-switching` to `<html>` for two animation frames while swapping theme so no element transitions colors; theme toggle icons crossfade (`scale-25 opacity-0 blur-[4px]` on the hidden icon).
- `prefers-reduced-motion: reduce` → no sidebar/stepper transitions; Settings → Appearance "Reduce motion" switch applies the same behavior client-side.

### 2.6 Breakpoints (map to Tailwind v4 custom breakpoints)

| Mockup width | Meaning                                          | Tailwind                                                     |
| ------------ | ------------------------------------------------ | ------------------------------------------------------------ |
| 1100         | two-column grids stack; side column becomes 2-up | `wide:` (define `--breakpoint-wide: 1100px`)                 |
| 1000         | site nav links collapse into menu                | `nav:` (`--breakpoint-nav: 1000px`)                          |
| 960          | auth art panel hides, form goes full width       | `split:` (`--breakpoint-split: 960px`)                       |
| 900          | app shell: sidebar → off-canvas, mobile topbar   | `shell:` (`--breakpoint-shell: 900px`)                       |
| 700 / 640    | phone layout (single column, full-width CTAs)    | `sm:` is 640 — use `max-sm:` and `max-[700px]:` where needed |

Use `max-*` variants (e.g. `max-shell:`) where the mockup CSS is `max-width`.

---

## 3. Tailwind v4 + shadcn/ui implementation

### 3.1 `resources/css/app.css` (the only stylesheet)

Everything below is **design tokens + Tailwind configuration**, which is the one kind of CSS that stays. Components get **no** CSS of their own (see §7).

```css
@import 'tailwindcss';
@import 'tw-animate-css'; /* already used by the repo's shadcn setup; keep the existing @source lines too */

@custom-variant dark (&:is(.dark *));
@custom-variant hov (@media (hover: hover) { &:hover }); /* hover only on real pointers */

/* ───── Light (default) ───── */
:root {
    color-scheme: light;

    /* shadcn variables → v2 palette */
    --background: #f5f6f8;
    --foreground: #0e1020;
    --card: #ffffff;
    --card-foreground: #0e1020;
    --popover: #ffffff;
    --popover-foreground: #0e1020;
    --primary: #4f63e8;
    --primary-foreground: #ffffff;
    --secondary: #f4f5f7;
    --secondary-foreground: #0e1020;
    --muted: #f4f5f7;
    --muted-foreground: #7e8398;
    --accent: #f4f5f7;
    --accent-foreground: #0e1020; /* shadcn "accent" = neutral hover surface, NOT the brand */
    --destructive: #b9322a;
    --border: rgb(16 19 40 / 0.07);
    --input: rgb(16 19 40 / 0.07);
    --ring: #4f63e8;
    --radius: 0.625rem; /* shadcn compat; v2 uses the named radius roles below */

    /* v2 extensions */
    --shell: #eff0f3;
    --sunken: #f4f5f7;
    --border-strong: rgb(16 19 40 / 0.13);
    --fg-2: #4b5066;
    --fg-3: #7e8398;
    --brand-hover: #4253d6;
    --brand-soft: #eef0fe;
    --brand-text: #3446c9;
    --success: #127a49;
    --success-soft: #e7f6ee;
    --warning: #a65a0b;
    --warning-soft: #fdf1e2;
    --danger: #b9322a;
    --danger-soft: #fcebea;
    --rose: #c2416f;
    --rose-soft: rgb(232 90 140 / 0.12);
    --overlay: rgb(14 16 32 / 0.32);

    --sh-card:
        0 0 0 1px rgb(16 19 40/0.05), 0 1px 2px rgb(16 19 40/0.04),
        0 6px 16px -10px rgb(16 19 40/0.1);
    --sh-raised:
        0 0 0 1px rgb(16 19 40/0.06), 0 2px 4px rgb(16 19 40/0.04),
        0 18px 44px -16px rgb(16 19 40/0.22);
    --sh-chip:
        0 0 0 1px rgb(16 19 40/0.07), 0 1px 2px rgb(16 19 40/0.06),
        0 4px 10px -4px rgb(16 19 40/0.1);
    --sh-btn:
        inset 0 1px 0 rgb(255 255 255/0.22), 0 1px 2px rgb(30 40 140/0.3),
        0 6px 16px -6px rgb(79 99 232/0.55);

    /* Atmosphere */
    --sky-band: linear-gradient(
        180deg in oklab,
        #c7d2fb 0%,
        #dcd9fb 30%,
        #f1dceb 55%,
        #fbd5bf 75%,
        #f6c2a3 90%,
        #e9d3e6 100%
    );
    --sky-hero: linear-gradient(
        180deg in oklab,
        #c7d2fb 0%,
        #dcd9fb 22%,
        #f1dceb 40%,
        #fbd5bf 52%,
        #f6c2a3 58%,
        #d9c3e2 68%,
        #b9c4f1 80%,
        #e9edfb 100%
    );
    --veil-band: linear-gradient(
        90deg,
        rgb(255 255 255/0.75),
        rgb(255 255 255/0.2) 60%,
        transparent
    );
    --veil-hero: linear-gradient(
        90deg,
        rgb(255 255 255/0.82) 0%,
        rgb(255 255 255/0.45) 45%,
        rgb(255 255 255/0) 75%
    );
    --streak: rgb(255 255 255 / 0.1);
    --glass: rgb(255 255 255 / 0.42);
    --glass-ring: rgb(255 255 255 / 0.7);
    --sky-ink: #0e1020;
}

/* ───── Dark ───── */
.dark {
    color-scheme: dark;
    --background: #09090c;
    --foreground: #f2f3f7;
    --card: #121217;
    --card-foreground: #f2f3f7;
    --popover: #121217;
    --popover-foreground: #f2f3f7;
    --primary: #5e70f0;
    --primary-foreground: #ffffff;
    --secondary: #1a1a21;
    --secondary-foreground: #f2f3f7;
    --muted: #1a1a21;
    --muted-foreground: #6f7286;
    --accent: #1a1a21;
    --accent-foreground: #f2f3f7;
    --destructive: #ff8a80;
    --border: rgb(255 255 255 / 0.07);
    --input: rgb(255 255 255 / 0.07);
    --ring: #5e70f0;

    --shell: #0e0e12;
    --sunken: #1a1a21;
    --border-strong: rgb(255 255 255 / 0.12);
    --fg-2: #a6a9ba;
    --fg-3: #6f7286;
    --brand-hover: #7181f4;
    --brand-soft: rgb(110 126 245 / 0.15);
    --brand-text: #a8b2ff;
    --success: #5bd49a;
    --success-soft: rgb(60 200 130 / 0.12);
    --warning: #f2b266;
    --warning-soft: rgb(240 160 70 / 0.13);
    --danger: #ff8a80;
    --danger-soft: rgb(255 110 100 / 0.12);
    --rose: #f58bb2;
    --overlay: rgb(0 0 0 / 0.55);

    --sh-card:
        0 0 0 1px rgb(255 255 255/0.05), inset 0 1px 0 rgb(255 255 255/0.03),
        0 8px 24px -14px rgb(0 0 0/0.6);
    --sh-raised:
        0 0 0 1px rgb(255 255 255/0.08), inset 0 1px 0 rgb(255 255 255/0.05),
        0 24px 60px -20px rgb(0 0 0/0.85);
    --sh-chip:
        0 0 0 1px rgb(255 255 255/0.08), inset 0 1px 0 rgb(255 255 255/0.05),
        0 6px 14px -6px rgb(0 0 0/0.6);
    --sh-btn:
        inset 0 1px 0 rgb(255 255 255/0.2), 0 1px 2px rgb(0 0 0/0.4),
        0 8px 24px -8px rgb(94 112 240/0.6);

    --sky-band: linear-gradient(
        180deg in oklab,
        #0b0c14 0%,
        #11132a 30%,
        #1d1b3d 55%,
        #43294a 78%,
        #6e3f41 92%,
        #2a2140 100%
    );
    --sky-hero: linear-gradient(
        180deg in oklab,
        #0b0c14 0%,
        #11132a 24%,
        #1d1b3d 40%,
        #43294a 50%,
        #8a4a3e 56%,
        #3a2a4c 64%,
        #181b38 76%,
        #0a0b12 100%
    );
    --veil-band: linear-gradient(
        90deg,
        rgb(9 9 12/0.85),
        rgb(9 9 12/0.3) 60%,
        transparent
    );
    --veil-hero: linear-gradient(
        90deg,
        rgb(9 9 12/0.9) 0%,
        rgb(9 9 12/0.55) 45%,
        rgb(9 9 12/0) 78%
    );
    --streak: rgb(255 255 255 / 0.035);
    --glass: rgb(255 255 255 / 0.05);
    --glass-ring: rgb(255 255 255 / 0.12);
    --sky-ink: #f2f3f7;
}

@theme inline {
    /* shadcn */
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
    /* v2 extensions → utilities: bg-shell, bg-sunken, text-fg-2, text-fg-3, text-brand, bg-brand-soft … */
    --color-shell: var(--shell);
    --color-sunken: var(--sunken);
    --color-border-strong: var(--border-strong);
    --color-fg-2: var(--fg-2);
    --color-fg-3: var(--fg-3);
    --color-brand-hover: var(--brand-hover);
    --color-brand-soft: var(--brand-soft);
    --color-brand: var(--brand-text);
    --color-success: var(--success);
    --color-success-soft: var(--success-soft);
    --color-warning: var(--warning);
    --color-warning-soft: var(--warning-soft);
    --color-danger: var(--danger);
    --color-danger-soft: var(--danger-soft);
    --color-rose: var(--rose);
    --color-rose-soft: var(--rose-soft);
    --color-overlay: var(--overlay);
    --color-glass: var(--glass);
    --color-glass-ring: var(--glass-ring);
    --color-sky-ink: var(--sky-ink);

    --shadow-card: var(--sh-card);
    --shadow-raised: var(--sh-raised);
    --shadow-chip: var(--sh-chip);
    --shadow-btn: var(--sh-btn);

    /* Radii: ADD named roles; do not redefine Tailwind's default scale (shadcn components rely on it) */
    --radius-xs: 7px;
    --radius-control: 10px;
    --radius-btn: 11px;
    --radius-inner: 14px;
    --radius-card: 20px;
    --radius-panel: 24px;
    --radius-band: 28px;

    --font-sans:
        'Geist Variable', 'Geist', ui-sans-serif, system-ui, -apple-system,
        sans-serif;
    --font-mono:
        'Geist Mono Variable', 'Geist Mono', ui-monospace, SFMono-Regular,
        Menlo, monospace;

    --ease-snap: cubic-bezier(0.22, 1, 0.36, 1);

    --breakpoint-wide: 1100px;
    --breakpoint-nav: 1000px;
    --breakpoint-split: 960px;
    --breakpoint-shell: 900px;

    --container-site: 1200px; /* max-w-site */
    --container-app: 1280px; /* max-w-app  */
}

@layer base {
    * {
        @apply border-border outline-ring/50;
    }
    html {
        -webkit-text-size-adjust: 100%;
    }
    body {
        @apply bg-background text-foreground font-sans text-[15px] leading-normal antialiased;
    }
    h1,
    h2,
    h3 {
        @apply font-medium tracking-[-0.02em] text-balance;
    }
    p {
        @apply text-pretty;
    }
    [hidden] {
        display: none !important;
    }
    :focus-visible {
        @apply outline-2 outline-offset-2 outline-primary rounded-md;
    }
}
```

**Utilities you get** → `bg-shell`, `bg-sunken`, `bg-card`, `text-fg-2`, `text-fg-3`, `text-brand`, `bg-brand-soft`, `shadow-card|raised|chip|btn`, `rounded-control|btn|inner|card|panel|band`, `font-mono`, `max-w-site`, `max-w-app`, `wide:` `nav:` `split:` `shell:` variants, `hov:` hover-capable-pointer variant.

### 3.2 Fonts

Use the repo's **existing font mechanism** — `laravel-vite-plugin/fonts` with `bunny()` in `vite.config.ts` and the `@fonts` directive already in `app.blade.php` — and swap the family: `bunny('Geist', { weights: [400, 500, 600] })` and `bunny('Geist Mono', { weights: [400, 500] })`. **No new dependency** (the CSP already allows `fonts.bunny.net`). Remove the `@import '@fontsource-variable/inter'` line from `app.css`; the Inter package stays installed but unused (DR-08).

### 3.3 Theme mechanism

- Class strategy: `<html class="dark">` for dark; none for light. (Replaces the mockups' `data-theme` attribute and the v1 forced-dark.)
- The repo's `hooks/use-appearance.tsx` (light / dark / system; localStorage + `appearance` cookie) is the single source of truth — **it currently always forces dark and must be fixed first (UI-02)**; the header toggle, auth toggle, sidebar toggle and **Settings → Appearance** all call it.
- `resources/views/app.blade.php` is currently hard-coded dark (`class="dark"`, `color-scheme: dark`, inline dark `<style>`). A flash-free light theme needs a small Blade edit (**BCR-21, approval required**): bind the class from the `$appearance` value that `HandleAppearance` already shares, delete the inline `<style>`, and add a pre-paint script for "system" **with `nonce="{{ Vite::cspNonce() }}"`** (the CSP forbids un-nonced inline scripts). Without approval, the theme applies after hydration.
- Wrap switches with the `theme-switching` class trick (§2.5).

### 3.4 shadcn/ui mapping

| UI piece                  | shadcn base                                                                     | v2 customization                                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                    | `button`                                                                        | `h-10 rounded-btn px-4 text-sm font-medium`, variants `primary` (shadow-btn), `secondary` (bg-card shadow-chip), `ghost`, `danger`, `danger-ghost`; sizes `sm` 36, `md` 40, `lg` 44 (auth), `xl` 46 (band CTAs); `block`; `active:scale-[.97]` |
| Icon button               | `button size="icon"`                                                            | 40px, `rounded-btn`, `bg-card shadow-chip` (ghost mini = 32px `rounded-lg`)                                                                                                                                                                    |
| Badge / chip              | `badge`                                                                         | `h-[22px] rounded-full px-2 text-xs font-medium`; tones success/warning/danger/accent/neutral; `dot` prop                                                                                                                                      |
| Shell + inner card        | `card`                                                                          | `Shell` (`bg-shell rounded-card p-1.5 shadow-[inset_0_0_0_1px_var(--border)]`) + `ShellHead` + `Inner` (`bg-card rounded-inner shadow-card p-5`)                                                                                               |
| Input / Textarea / Select | `input`, `textarea`, `select`                                                   | `h-[42px] rounded-control bg-sunken shadow-[inset_0_0_0_1px_var(--border)]`; focus → `bg-card shadow-[inset_0_0_0_1.5px_var(--primary),0_0_0_4px_var(--brand-soft)]`; invalid → ring `danger`                                                  |
| Label / Field             | `label`                                                                         | `Field` wrapper = label + control + hint + error (`aria-describedby`, `aria-invalid`)                                                                                                                                                          |
| Choice chips (radio)      | shadcn `radio-group` (added with CLI v4; style via `data-[state=checked]:`)     | Label tiles, `has-[:checked]:bg-brand-soft has-[:checked]:text-brand has-[:checked]:shadow-[inset_0_0_0_1.5px_var(--primary)]`                                                                                                                 |
| Checkbox                  | `checkbox`                                                                      | 18px, accent color primary                                                                                                                                                                                                                     |
| Switch                    | shadcn `switch` (CLI v4)                                                        | 38×22, thumb 16px                                                                                                                                                                                                                              |
| Tabs (state)              | shadcn `tabs` (CLI v4) for state segs; `toggle-group` where a button group fits | Segmented control `Seg` (bg-sunken, p-[3px], active tile bg-card shadow-chip)                                                                                                                                                                  |
| Tabs (route)              | `Link`s                                                                         | Same `Seg` look for admin filters; **settings sub-nav** uses links                                                                                                                                                                             |
| Accordion / FAQ           | `accordion` (or native `details`)                                               | `rounded-2xl bg-card shadow-card`, plus-icon tile rotating 45°                                                                                                                                                                                 |
| Dialog / confirm          | shadcn `alert-dialog` for confirmations (CLI v4); `dialog` for forms            | Replaces native `<dialog>`; inner-card styling, `Cancel` ghost + primary                                                                                                                                                                       |
| Sheet                     | `sheet`                                                                         | Mobile site nav; app sidebar drawer (or custom off-canvas)                                                                                                                                                                                     |
| Table                     | `table`                                                                         | `rounded-inner` wrapper, sunken header row, `px-3.5 py-3` cells, row hover `bg-sunken`                                                                                                                                                         |
| Toast                     | `sonner`                                                                        | Inverted pill: `bg-foreground text-background`, check icon in success color                                                                                                                                                                    |
| OTP                       | `input-otp`                                                                     | 6 slots, 56px high, mono 22px                                                                                                                                                                                                                  |
| Progress                  | `progress`                                                                      | Upload progress                                                                                                                                                                                                                                |
| Avatar                    | `avatar`                                                                        | Gradient fallbacks `av-1…av-6` (see §5.4)                                                                                                                                                                                                      |
| Separator                 | `separator`                                                                     | `Divider` 1px border, `my-4`                                                                                                                                                                                                                   |
| Skeleton                  | `skeleton`                                                                      | Loading states if added                                                                                                                                                                                                                        |

---

## 4. Layouts (Inertia persistent layouts)

### 4.1 Site layout — public pages (`home`, `services`, `pricing`, `about`, `contact`, `legal/*`, `error`)

```
<SkipLink/>
<div class="p-3 max-sm:p-2">                           ← band-wrap
  <header class="sky band rounded-band overflow-hidden isolate relative">
     <SiteNav/>                                        ← flex, px-7 py-5, links centered
     <BandCopy/>  (per page: ChipEyebrow, H1 with <em>, lead, CTAs)
  </header>
</div>
<main id="main">…sections…</main>
<CtaBand/> (home/closing, optional)
<SiteFooter/>                                          ← rounded-band card footer, mx-3
```

- **Band**: `bg-(image:--sky-band)`; `::before` streaks = repeating 3px/11px lines in `--streak` with `blur(1.5px)` at `-z-20`, `::after` = veil gradient `--veil-band` at `-z-10`. Express with `before:`/`after:` utilities and arbitrary values; no CSS file.
- **SiteNav**: logo mark (32px, `rounded-[9px]`, primary bg, inset highlight + glow) + two-line wordmark; center mono uppercase links (`aria-current="page"` → `text-foreground font-medium`); right: theme toggle (icon button), **Client login** (secondary, 36px), **Start my return** (primary, 36px; links to `contact#start`). Below `nav:` links collapse into a menu (Sheet) containing links + both actions.
- **Footer**: `bg-card rounded-band shadow-card mx-3 p-12`; grid `1.4fr 1fr 1fr 1.2fr`: brand + blurb / Explore / Get in touch (phone, email, "Book a consultation") / Offices (4 street addresses + city). Bottom row: © + shield "IRS Publication 4557 & FTC Safeguards compliant" + Privacy / Terms / Security (WISP).
- **Section rhythm**: `py-24` (96px) → `py-[72px]` on phones; `tight` variant `py-16`; container `max-w-site px-6` (`px-4` phones).
- **Section head** (`SecHead`): grid `1fr auto`, chip-eyebrow + H2 left, secondary paragraph right-aligned (left on phones); `center` variant stacks.
- Error page: same band, `data-no-footer` (no footer).

### 4.2 Auth layout — split screen (`auth/*`)

```
<div class="grid min-h-screen grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] max-split:grid-cols-1">
  <section class="flex flex-col px-10 py-7">                ← form column
     top: logo ("Okojie Online" / "Okojie & Associates") + theme toggle
     body: max-w-[400px], centered vertically: eyebrow, H1, lead, form, switch-line
     foot: shield "IRS Pub 4557 & FTC Safeguards compliant" · Privacy · Terms
  </section>
  <aside aria-hidden class="… rounded-panel m-3 hidden split:flex">   ← art
     sky gradient (--sky-hero) + streaks; trust chips ("Encrypted portal", "2FA on every account");
     glass card (bg-glass ring glass-ring backdrop-blur-lg) containing a mini portal preview:
     "Your 2026 return" + "In preparation" chip + 3 file rows (W-2, 1099-INT, Photo ID, all "Clean")
  </aside>
</div>
```

`2FA` screens use the same shell; icon tiles (`big-tile`) replace the eyebrow on verify/confirm states.

### 4.3 App shell — portal, admin, settings

```
<div class="grid min-h-screen grid-cols-[248px_minmax(0,1fr)] max-shell:grid-cols-1">
  <aside class="sticky top-0 h-screen overflow-y-auto bg-shell border-r p-3 …">     ← becomes fixed off-canvas 280px < 900px
     workspace block (mark + name + sub)  ·  nav groups (eyebrow label + items)  ·  side-foot: help card (portal) + profile row (avatar, name, sub, logout icon-btn)
  </aside>
  <div class="min-w-0">
     <div class="topbar-mobile …">   ← only < 900px: menu button, workspace, theme toggle (sticky, blurred bg)
     <main id="main" class="max-w-app px-9 pt-7 pb-16 max-shell:px-4 max-shell:pt-5 max-shell:pb-[120px]">
  </div>
</div>
<Scrim/>  (fixed inset-0 bg-overlay, opacity transition)
```

- **Nav item**: 38px, `rounded-[10px]`, secondary text; active (`aria-current="page"`): `bg-card shadow-card text-foreground font-medium`, icon in brand color, plus a 3px accent bar at the left edge (`before:`). Optional count pill: primary-filled (unread) or muted/plain (totals).
- **Portal nav** (workspace "Okojie Online · Client portal"): _Your return_ → Overview, Documents (count), Appointments, Messages (unread count) · _Account_ → Referrals, Security & 2FA. Help card: "Questions about your return?" + Open messages + phone. Profile: initials avatar, name, `"{Tier} · {email}"`.
- **Admin nav** (workspace "Okojie Staff · Admin", dark mark): _Workspace_ → Clients (count), Leads (count), Referrals · _Account_ → Settings. Profile: staff avatar, name, `"Preparer · {office}"`.
- **Page head**: eyebrow, H1, optional sub (chips/hints), right-aligned actions (`theme-btn` hidden < 900px, since the topbar has it).
- Grids: `grid-2` = `minmax(0,1fr) minmax(0,340px)` (gap 16, align start); `form-left` = `minmax(0,380px) minmax(0,1fr)`; both → 1 column < 1100px (side column 2-up, 1-up < 640). `grid-even` 1fr 1fr → 1 column < 900px.
- **Settings** (`settings/*`) uses the admin shell for staff and the portal shell for clients (same layout component as the user's role) with a 2-column inner layout: sub-nav (Profile / Security / Appearance) + content column.

---

## 5. Components (specs; build as React + Tailwind, no CSS files)

### 5.1 Buttons

`h-10 px-4 rounded-btn text-sm font-medium` inline-flex center gap-2, `transition-[background-color,box-shadow,scale] duration-150`, `active:scale-[.97]`.

- **primary** `bg-primary text-primary-foreground shadow-btn hov:bg-brand-hover`
- **secondary** `bg-card text-foreground shadow-chip hov:bg-sunken`
- **ghost** `bg-transparent text-fg-2 hov:bg-sunken hov:text-foreground`
- **danger** / **danger-ghost**: danger text; danger = soft danger bg; used for _Delete account_ and _Turn off two-factor_.
- Modifiers: `block` (w-full), icon left (`pl-[13px]`) / right (`pr-[13px]`), disabled (opacity-60, no pointer events; used by "Sign and authorize" until valid).
- Sizes: auth buttons 44px; band/CTA 46px with `px-5 text-[15px]`; site nav 36px `rounded-[10px]`; pager/appointment 32–36px.

### 5.2 Chips & status

- **Chip**: `inline-flex h-[22px] items-center gap-1.5 rounded-full px-2 text-xs font-medium`. Tones: success / warning / danger / accent → soft bg + text color; **neutral** → `bg-sunken text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]`. `dot` adds a 6px currentColor dot.
- **StatusLabel** (inline, no bg): icon 15px + 12.5px/500 text in tone color (ok / wait / warn / bad / info). Used for scan state, return stage in tables, referral status.
- **Tier chip** (`Hybrid`) = chip-neutral in tables, chip-accent in page head.

### 5.3 Shell + Inner card

```
<Shell>                       bg-shell rounded-card p-1.5 shadow-[inset_0_0_0_1px_var(--border)] min-w-0
  <ShellHead>                 flex items-center justify-between gap-3 px-3.5 pt-2.5 pb-3 min-h-12 flex-wrap
     <h2 class="text-[15px] font-medium tracking-[-0.01em] flex items-center gap-2"> <Icon class="text-fg-3"/> Title </h2>
     right slot: chip / hint / link / Seg
  </ShellHead>
  <Inner>                     bg-card rounded-inner shadow-card p-5 (p-4 on phones)
```

`Inner` variants: `flush-empty` (p-1.5, holds an Empty well), `metrics` (p-0, grid of metrics), `paper` (receipt).

### 5.4 Avatar

34px circle, 12.5px/600 initials, gradient `135deg in oklab` (`#A9B4FF → #F6C7B0` default; `av-2` `#9EE2C4 → #A8C3FF`; `av-3` `#FFD2A1 → #F7A9C4`; `av-4` `#C9B8FF → #9FD5FF`; `av-5` `#FFE29A → #B8E5A8`; `av-6` `#B5E3F5 → #E1C2FF`), ink `#1B1D3A`, 1px inner outline. Pick by hashing the name.

### 5.5 Forms

- **Field**: `grid gap-[7px]`; label 13.5px/500; optional text `text-fg-3 font-normal`; hint 12.5px `text-fg-3`; error 12.5px `text-danger` with alert icon.
- **Input/Select**: see §3.4. Select has a custom chevron (Lucide `ChevronDown` positioned right) — drop the mockup's data-URI background image.
- **Textarea** 96px min height, vertical resize.
- **ChoiceGroup**: grid with `--cols` (3 default; 1 on phones), radio tiles with leading icon (Video/Phone/In person use video, phone, building icons), checked state per §3.4.
- **Check**: 18px checkbox + 14px label, `items-start gap-2.5`.
- **Switch**: 38×22 track (`bg-border-strong` → `bg-primary`), 16px white thumb, shadow.
- **Password reveal**: 32px ghost icon button absolutely positioned (`right-[5px] top-[5px]`), toggles Eye / EyeOff, `aria-label` "Show password" / "Hide password".
- **Password meter**: 4 segments (`i.on` = filled) with hint "Strong · 19 characters" (client-side heuristic).
- **OTP**: 6 inputs (shadcn `input-otp`), 56px square, mono 22px, auto-advance, backspace-back, paste distributes digits.
- **Drop zone**: dashed 1.5px `border-strong`, `rounded-xl bg-sunken`, centered icon tile + "Drag a file here or **browse**" + helper; hover/drag → `border-primary bg-brand-soft`. Selected-file row replaces it (file badge, name, "96 KB · ready to upload", remove button).

### 5.6 Data display

- **Metrics strip** (`Inner` p-0): grid 4 (or 3) cols; cell `p-5 gap-2.5`, dividers `border-l`, top row = 28px **tile** (indigo/green/amber/rose) + label 13px; value 26px; context 12.5px tertiary (`hot` = brand). Becomes 2×2 (and 1 col for `three`) < 900px with matching corner radii. Links get hover bg.
- **List / Row**: `grid p-1`; row `flex items-center gap-3 px-2 py-3 border-t`; `row-meta` = name 14px/500 truncate + small 12.5px tertiary. **File badge** = 34px sunken tile with mono 9.5px extension. Row actions = 32px mini buttons (download disabled for blocked files).
- **List foot**: border-top, 13px tertiary with shield icon.
- **Table**: `rounded-inner` overflow-x-auto wrapper; header `bg-sunken text-[12.5px] font-medium text-fg-3`; first/last header corners rounded 10px; cell `px-3.5 py-3`; numeric right-aligned `tabular-nums`; clickable row hover `bg-sunken`. Cell with avatar + name + email (`cell-2`).
- **Toolbar**: search (36px, `rounded-control`, `bg-card shadow-chip`, min-w 240, focus-within halo) + filter buttons (36px) ; pager row: "Showing 1–8 of 24" + Previous / Next (32px).
- **Seg** (segmented control): described in §3.4; with optional count (`text-[11.5px] text-fg-3 tabular-nums`).
- **KV list**: rows `flex justify-between gap-4`, label tertiary, value right-aligned.
- **Calendar tile**: 52px, month (mono 10px caps on primary bg) over day (20px/500) on card with chip shadow.
- **Timeline**: dot + title 14px + small tertiary (+ optional italic reason).
- **Stepper (return status)**: 5 columns on ≥640px with a 2px track and a primary fill (width = `idx/4 × 80%`), 26px dots (done = primary filled with check; now = ring + 9px inner dot + 5px soft halo; todo = ring only); label 13.5px (todo tertiary), date/“Now” small beneath. < 640px: vertical list with connecting line.
- **Next-step card**: sunken (or accent-soft when action needed) 12px radius, icon tile 36px, eyebrow ("What happens next" / "Action needed" / "All done"), H3 16px, body 14px, optional CTA.
- **Empty state**: sunken rounded well (min-h 280, `sm` 200), 52px icon tile with chip shadow, H3 16.5px, 14px tertiary text (max 36ch), centered actions.
- **Note** (callout): 13.5px, `rounded-control`, icon + text; tones neutral (sunken + ring), accent, warn, ok.
- **Toast**: fixed bottom-center, inverted colors, check icon, 2.2s; implement via `sonner` themed.

### 5.7 Marketing blocks

- **ChipEyebrow**, **SecHead**, **Card** (`bg-card rounded-card shadow-card`), **FAQ item** (details, `rounded-2xl`, 18px/20px padding, plus tile), **CTA band** (`rounded-band` sky background, centered H2/lead/CTAs), **Tier row** (services), **Tier card** (home), **Compare table** (pricing), **Add-on strip**, **How cards (01/02/03)**, **Team portrait card**, **Office card/row**, **Story + stats** (about), **Legal article** with TOC.

### 5.8 Dialogs

Mockups use native `<dialog>`: convert to shadcn `AlertDialog`/`Dialog` using the Inner-card style, `h3` + paragraph + optional field + footer (`Cancel` ghost, primary action). Dialogs exist for: convert lead, mark referral rewarded, advance stage, reverse stage (reason required), mark invoice paid, delete account (new, confirm).

---

## 6. Icons

Mockups use a custom 24px sprite (stroke 1.7, round caps). Use **lucide-react** with `strokeWidth={1.7}`, sizes 18px (default) / 15px (small). Mapping:

| Sprite   | Lucide              | Sprite          | Lucide           | Sprite    | Lucide              |
| -------- | ------------------- | --------------- | ---------------- | --------- | ------------------- |
| check    | `Check`             | arrow           | `ArrowRight`     | chev      | `ChevronDown`       |
| grid     | `LayoutGrid`        | doc             | `FileText`       | cal       | `CalendarDays`      |
| msg      | `MessageSquare`     | gift            | `Gift`           | shield    | `ShieldCheck`       |
| pen      | `PenLine`           | upload          | `Upload`         | download  | `Download`          |
| card     | `CreditCard`        | phone           | `Phone`          | video     | `Video`             |
| building | `Building2`         | clock           | `Clock`          | lock      | `Lock`              |
| key      | `KeyRound`          | logout          | `LogOut`         | sun       | `Sun`               |
| moon     | `Moon`              | monitor         | `Monitor`        | menu      | `Menu`              |
| send     | `Send`              | receipt         | `Receipt`        | hourglass | `Hourglass`         |
| trash    | `Trash2`            | eye / eyeoff    | `Eye` / `EyeOff` | copy      | `Copy`              |
| users    | `Users`             | user            | `User`           | inbox     | `Inbox`             |
| search   | `Search`            | filter / funnel | `ListFilter`     | plus      | `Plus`              |
| x        | `X`                 | dots            | `Ellipsis`       | alert     | `CircleAlert`       |
| info     | `Info`              | printer         | `Printer`        | link      | `Link2`             |
| mail     | `Mail`              | pin             | `MapPin`         | sliders   | `SlidersHorizontal` |
| globe    | `Globe`             | spark           | `Sparkles`       | swap      | `ArrowLeftRight`    |
| bars     | `ChartNoAxesColumn` | note            | `StickyNote`     | ban       | `Ban`               |
| refresh  | `RefreshCw`         | qr              | `QrCode`         |           |                     |

Never recreate the sprite. Decorative icons get `aria-hidden`.

---

## 7. CSS → Tailwind policy (required)

**Goal:** zero hand-written component CSS.

Allowed in CSS: `resources/css/app.css` only, containing the `@import`, `@plugin`, `@custom-variant`, token variables (§3.1), `@theme inline`, and the small `@layer base` block. **Nothing else.**

Forbidden: any other `.css` file (delete `resources/css/home.css` after migrating), `<style>` tags, CSS modules, `@apply` outside the base layer and shadcn-generated files, styled-components, `@layer components` classes like `.home-sky`.
Components are added with **shadcn CLI v4** (`vendor/bin/sail npx shadcn@latest add <name>`; run `--help`/`info` first). Repo specifics: formatting/linting is **Vite+** (`vendor/bin/sail npm run check:fix` sorts Tailwind classes written in `cn()`/`clsx()`/`cva()`); `components/ui/*` is excluded from lint, so custom primitives live in `components/primitives/`; there is no `scripts/` folder (AGENTS forbids new base folders).
Inline `style={{…}}` only for truly dynamic values (e.g. stepper fill `width`, `--cols`, avatar hue); prefer CSS variables set via `style` and consumed by utilities.

### Conversion map (mockup class → implementation)

| Mockup CSS                                                                                      | Becomes                                                                           |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `.btn .btn-primary/-secondary/-ghost .btn-block .has-icon-*`                                    | `<Button variant size block>` (cva)                                               |
| `.icon-btn`, `.mini-btn`, `.theme-btn`                                                          | `<IconButton>`, `<ThemeToggle>`                                                   |
| `.chip .chip-*`, `.chip-dot`                                                                    | `<Chip tone dot>`                                                                 |
| `.shell .shell-head .inner`                                                                     | `<Shell>`, `<ShellHead>`, `<Inner>`                                               |
| `.eyebrow`, `.chip-eyebrow`                                                                     | `<Eyebrow>`, `<ChipEyebrow icon>`                                                 |
| `.input .select textarea.input .field .hint .err .legend`                                       | `<Input> <Select> <Textarea> <Field>`                                             |
| `.choice`                                                                                       | `<ChoiceGroup>` with `has-[:checked]`                                             |
| `.check`, `.switch`                                                                             | `<Checkbox>`, `<Switch>`                                                          |
| `.otp`                                                                                          | `<InputOTP>`                                                                      |
| `.drop`, `.selected-file`                                                                       | `<FileDropzone>`                                                                  |
| `.metrics .metric .tile .t-*`                                                                   | `<MetricStrip>`, `<Metric tone>`                                                  |
| `.list .row .row-meta .file .status .list-foot`                                                 | `<RowList>`, `<FileBadge>`, `<StatusLabel>`                                       |
| `table.t`                                                                                       | shadcn `Table` + `<DataTable>` styling                                            |
| `.toolbar .search .filter-btn .pager`                                                           | `<TableToolbar>`, `<SearchInput>`, `<FilterButton>`, `<Pager>`                    |
| `.seg`                                                                                          | `<Seg>` (state) / `<SegLinks>` (routes)                                           |
| `.empty .icon-tile`                                                                             | `<EmptyState icon title body actions size>`                                       |
| `.note .note.warn/.ok/.accent`                                                                  | `<Note tone>`                                                                     |
| `.kv .divider .timeline .appt .cal`                                                             | `<KeyValue>`, `<Divider>`, `<Timeline>`, `<AppointmentRow>`, `<CalendarTile>`     |
| `.stepper .step .next`                                                                          | `<ReturnStepper>`, `<NextStepCard>`                                               |
| `.app .sidebar .nav-item .profile .help .topbar-mobile .scrim`                                  | `<AppShell>`, `<SidebarNav>`, `<ProfileRow>`, `<HelpCard>`                        |
| `.band .snav .band-copy .sfoot .cta-band .faq-*`                                                | `<SiteBand>`, `<SiteNav>`, `<BandCopy>`, `<SiteFooter>`, `<CtaBand>`, `<FaqList>` |
| `.auth .auth-art .art-card .art-trust`                                                          | `<AuthLayout>`, `<AuthArt>`                                                       |
| `.toast`                                                                                        | `sonner`                                                                          |
| `.mock-panel`, `[data-view]`, `[data-when]`, `[data-state]`                                     | **Not built** — replaced by real prop-driven states                               |
| `.sr-only`, `.skip-link`, `.num`                                                                | Tailwind `sr-only`, `<SkipLink>`, `tabular-nums`                                  |
| Page `<style>` blocks (e.g. `.stepper`, `.amount`, `.lead`, `.tier-row`, `.compare`, `.person`) | Utility classes on the owning component                                           |

---

## 8. Accessibility checklist (carried from mockups)

- `Skip to content` link first in every layout, target `#main`.
- `:focus-visible` 2px primary outline, 2px offset.
- Landmarks: `nav` with `aria-label` ("Primary", "Client portal navigation", "Settings", "On this page", "Legal"); `main#main`; `aside aria-label`.
- Sections labelled via `aria-labelledby` to their H2.
- Return stepper: `role="list"`/`listitem`, current step `aria-current="step"`.
- Tabs: `role="tablist"/"tab"` with `aria-selected` for state segs; links with `aria-current="page"` for route navs.
- Status/feedback: `role="status"` (resent, success, next step), `role="alert"` (sign-in error, 2FA gate).
- Icon-only buttons have `aria-label`; blocked-file download button explains why ("Blocked file can't be downloaded").
- QR code container `role="img"` with label; OTP group `role="group"` + per-digit labels; `autocomplete="one-time-code"` on first digit / recovery field.
- Forms: `autocomplete` tokens (`email`, `current-password`, `new-password`, `name`, `tel`), `inputmode`, visible labels everywhere (v1 login had none).
- Contrast: tertiary text on shell/sunken must stay ≥ 4.5:1 in both themes — verify with axe; adjust token if it fails and log it.
- Respect `prefers-reduced-motion` and the in-app "Reduce motion" setting.

---

## 9. Do not build

`mockups/index.html`, the dark **Mockup states** panel (`.mock-panel`, `window.MOCK_CONTROLS`), `data-view`/`data-when`/`data-state` toggling, hard-coded sample names/numbers (Denise Robinson, $275, RCPT-2027-00418, etc.), placeholder team members and refund amounts (see `CONTENT.md` §R). All of these become real data from Inertia props or are removed.
