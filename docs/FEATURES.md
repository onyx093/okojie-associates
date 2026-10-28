# FEATURES — Complete Inventory with Acceptance Criteria

> **Approvals update:** every BCR was approved; text below that says _fallback_, _hidden_ or _[BCR-xx]_ describes the interim — the approved specs in `BACKEND-CHANGE-REQUESTS.md` define the final behavior.

Tags: **[MOCKUP] [INFERRED] [CLAIMED] [DRAFTED]** (the earlier **[OBSERVED]** tag referred to the original site screenshots). Priority: **P0** must-have for parity, **P1** needed to function, **P2** nice-to-have.

---

## A. Global / Layout [MOCKUP]

Tags in this file: **[MOCKUP]** = defined by `frontend/mockups/*.html` (Redesign 2026); **[INFERRED]** = needed for the UI to work but not shown; **[BCR-xx]** = depends on a pending Backend Change Request (a fallback ships meanwhile — see `BACKEND-CHANGE-REQUESTS.md`). Visual details: `DESIGN_SYSTEM.md`. States: `UI-STATE-MATRIX.md`.

### A1. Site header band + primary nav — P0

- Rounded sky-gradient band (28px) holding the nav and the page's hero copy. Nav: logo mark ("O") + two-line wordmark ("Okojie & Associates" / "Okojie Online"); center mono uppercase links Home · Services · Pricing · About · Contact (`aria-current="page"`); right: theme toggle, **Client login** (secondary), **Start my return** (primary → `/contact#start`). Authed: **My portal** replaces both (+ Sign out in the menu).
- Below the 1000px breakpoint the links collapse into a menu sheet containing links and both actions.
- **AC:** Guest/authed variants swap without flash (server-shared props); keyboard operable; sheet traps focus and closes on Esc/route change.

### A2. Site footer — P0

Rounded card (28px) with four columns: brand + blurb + newsletter; Explore (Home, Services, Pricing, About, Contact, Client login); Get in touch (phone, email, "Book a consultation" → `/contact#consult`); Offices (four addresses). Bottom row: © {year}, shield + "IRS Publication 4557 & FTC Safeguards compliant", links Privacy policy · Terms of service · Security (WISP).

- **AC:** Newsletter validates, posts to the existing subscribe route, inline `role=status` result; year dynamic; no double period.

### A3. Theme — P0

Light, dark, or system; toggle in the site nav, auth top bar, app topbar/page head; full control in Settings → Appearance. Persisted; applied before first paint (no flash). Same mechanism everywhere (`.dark` class).

### A4. App shell (portal, admin, settings) — P0

Sticky 248px sidebar (shell grey) with grouped nav, active bar, count pills, help card (portal) and profile row with logout; below 900px a mobile topbar + off-canvas drawer with scrim.

- **AC:** Drawer opens/closes by button, scrim, Esc; focus returns to the trigger; active item reflects the current URL; badges only show data that exists (BCR-12 fallback).

### A5. Auth split layout — P0

Form column (logo + theme toggle, form, compliance footer) + decorative art panel (sky gradient, trust chips "Encrypted portal" / "2FA on every account", glass mini-portal card). Art hides below 960px.

### A6. Accessibility & motion — P0

Skip link on every layout; `:focus-visible` outline; landmarks/labels; `prefers-reduced-motion` and in-app "Reduce motion" honored; scroll-reveal is optional/progressive (content visible without JS).

### A7. Toasts — P0

Inverted pill, bottom-center, 2.2s, success check icon; used for form success messages (copy per mockup `data-toast`).

---

## B. Home page (`/`) [MOCKUP — already React in `frontend/resources/js/components/home`]

### B1. Hero — P0

Sky-gradient band with nav; badge "26+ years · Philadelphia & Baltimore"; H1 "The convenience of online filing, with a **real tax professional.**" (em in accent); lead "Upload your documents, review with your preparer by video, e-sign and file — all from home, backed by a team that knows Pennsylvania and Maryland."; CTAs "Start my return online" (primary, → `/contact#start`) and "Book a free consultation" (secondary, → `/contact#consult`); trust row (Secure client portal · Credentialed preparers · Local PA & MD knowledge). Decorative **portal preview** (glass frame with floating tags "Encrypted upload", "IRS Form 8879 e-sign", sidebar, return stepper, documents) — `role="img"` with description; sample data is allowed **only** here. **Hero photo layer (D-08):** a licensed photo supplied by the owner at `public/images/hero.webp` sits under the sky veil (decorative, `alt=""`, `fetchpriority="high"`); until the file exists the hero renders sky-only.

### B2. Stats strip — P0

26+ Years · 40,000+ Returns filed · 12 Credentialed preparers · 4 Offices (from `site.stats`).

### B3. Tiers — P0

Section "Three ways to file" with three tier cards (Upload & Go, Hybrid [Most popular], Premium Remote): tag, name, tagline, From price, features, "Best for", CTA "Choose …". Link "See full pricing" → `/pricing`.

- **CTA:** guest → `/register?tier={slug}`; authed → `PATCH portal.tier.update` then portal.

### B4. How it works — P0

"From start to filed, without an office visit" — five steps (Book, Upload, Prepare, Review & e-sign, E-file) with icons.

### B5. Testimonials — P0

"What clients say" — quotes with stars and attribution; carousel/scroll controls.

### B6. Videos — P0

"See how it works before you start" — tabbed groups (Getting Started, Portal guides, Client stories); cards open a dialog player; no URL ⇒ "Coming soon".

### B7. Offices — P0

"Find us in person" — four office cards (address, phone `tel:`, hours) + "Prefer to stay home?" card with CTA to start online.

### B8. Referral banner — P0

"Earn $25–$50 for every friend you refer" with CTAs: authed → `/portal/referrals`; guest → `/register?next=/portal/referrals`.

### B9. Intake form — P0

"Start your return online": left copy + quote form (name, email, phone, tier chips, situation); posts via `use-quote-form` (honeypot, throttling, inline errors, success panel, toast on failure). Honors `?tier` and `?ref`.

### B10. FAQ — P0

"Questions, answered" — eight items, first open; plus-tile accordion.

### B11. Final CTA band — P0

Sky band "Same trusted preparers. No waiting room." with the two CTAs.

---

## C. Shared components

### C1. Tier card / tier row — P0 [MOCKUP]

Card (home) and horizontal row (services) share data: slug, name, tag, price range, features, best-for, featured flag. CTA behavior as B3.

### C2. Offices — P0

| #                                                                                   | City             | Address                  | Phone          | Hours                          |
| ----------------------------------------------------------------------------------- | ---------------- | ------------------------ | -------------- | ------------------------------ |
| 1                                                                                   | Philadelphia, PA | 5601 Germantown Ave      | (215) 555-0142 | Mon–Fri 9am–6pm · Sat 10am–2pm |
| 2                                                                                   | Philadelphia, PA | 2301 N. Broad St         | (215) 555-0178 | Mon–Fri 9am–6pm                |
| 3                                                                                   | Philadelphia, PA | 6300 W. Chelten Ave      | (215) 555-0193 | Mon–Fri 9am–5pm · Sat 10am–1pm |
| 4                                                                                   | Baltimore, MD    | 4100 Liberty Heights Ave | (410) 555-0166 | Mon–Fri 9am–6pm                |
| Presented as cards (home/about) and as rows with a **Directions** button (contact). |

### C3. FAQ — P0

Details/accordion with plus tile; page-specific subsets (Home 8, Services 4, Pricing 3) [BCR-22 fallback].

### C4. Lead forms — see D1.

### C5. Tier finder — P1 [MOCKUP, new]

Three questions (income, how to meet, states) → live recommendation (name, reason, price, CTA). Pure client logic; truth table in `UI-STATE-MATRIX.md` (D-02, corrected: any non-W-2 income or more than one state → Premium Remote; W-2 + one state → Hybrid if office, else Upload & Go).

---

## D. Contact page (`/contact`) [MOCKUP]

- Band: chip "Contact", H1 "Talk to a real person.", lead.
- **Ways cards:** Call us, Email (We reply within one business day), Hours.
- **Single form with a segmented switch:** _Get a free quote_ | _Book a consultation_ (replaces the two separate forms).
    - Shared: Full name, Phone (optional), Email.
    - Quote: tier chips (Upload & Go · Hybrid · Premium Remote · Not sure), situation.
    - Consultation: preferred date, time (Any time / Morning / Afternoon / Evening), format chips (Video / Phone / In person).
    - Hint "Never share your SSN here."; button label follows the tab.
- Deep links: `#start` quote, `#consult` / `?type=consult` consult; `?tier=`, `?ref=` honored.
- **AC:** Posts to `leads.quote` or `leads.consult` per tab (existing endpoints/fields); shared values survive tab switches; validation, throttle, success toast "Thanks! A preparer will be in touch within one business day."
- **Offices** list with Directions.

---

## E. Services page (`/services`) [MOCKUP]

Band ("Tax help that fits _your situation._", CTAs "Help me choose" → `#guide`, "Compare prices"); three tier rows (Hybrid featured, second CTA "Book a free consultation"); add-on list (5; Bookkeeping "/ mo"); tier finder; FAQ "Choosing a service" (4). The old "Not sure which tier fits?" quote form is **replaced by the tier finder**.

## F. Pricing page (`/pricing`) [MOCKUP]

Band ("Clear prices. No surprises."); **comparison table** (feature × tier, grouped, ✓/—, Hybrid highlighted with "Most popular", Choose buttons in headers, horizontal scroll with sticky first column on phones); add-on strip ("Add to any tier"); "You see the price before you pay" (01 We review your documents · 02 You approve and pay online · 03 Your receipt is saved); FAQ "Pricing questions" (3).

## G. About page (`/about`) [MOCKUP]

Band ("A neighborhood firm, now online."); story + 4 stats; **team** (4 preparer cards — sample — the visible note "Sample team. Replace with real names, titles and photos." stays, D-05); security (4 cards: IRS Publication 4557, FTC Safeguards Rule, Multi-factor authentication, IRS-compliant e-signature); offices.

---

## H. Authentication (7 screens) [MOCKUP]

Shared: AuthLayout, visible labels, reveal toggle on every password, `autocomplete` tokens, errors via `role=alert`, Fortify routes/fields unchanged.

| ID  | Screen                         | Content & behavior                                                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H1  | **Sign in** `/login`           | "Sign in to Okojie Online"; email; password + "Forgot password?"; "Keep me signed in on this device" (`remember`); error "That email and password don't match. Check them and try again."; switch "New to Okojie Online? Start your return". **"Sign in with a passkey"** uses the existing Fortify passkey components [BCR-17 ✅]. |
| H2  | **Create account** `/register` | "Create your account"; Full name, Email, Password (hint + strength meter), Confirm password, Terms/Privacy checkbox (client-side) [BCR-18]; carries `?tier`, `?next`.                                                                                                                                                               |
| H3  | **Verify email**               | "Verify your email"; "Send the link again" → resent note; Log out. Email verification is **enabled** by BE-12 [BCR-23 ✅].                                                                                                                                                                                                          |
| H4  | **Two-factor challenge**       | 6-box OTP (auto-advance/backspace/paste) ⇄ recovery-code field.                                                                                                                                                                                                                                                                     |
| H5  | **Forgot password**            | form ⇄ "Check your email … expires in 60 minutes".                                                                                                                                                                                                                                                                                  |
| H6  | **Reset password**             | email, new, confirm; invalid-token state.                                                                                                                                                                                                                                                                                           |
| H7  | **Confirm password**           | "Confirm it's you" before security changes. Passkey alternative where the existing wiring supports it [BCR-17 ✅].                                                                                                                                                                                                                  |

- **AC:** Wrong credentials → generic error; throttled → message; weak password rejected; success → `/portal` (or verify/2FA as today); referral/tier carried; MFA enforced as before.

---

## I. Client portal (`/portal`) [MOCKUP]

App shell (A4) with nav: Your return → Overview · Documents · Appointments · Messages; Account → Referrals · Security & 2FA. Page head: eyebrow, H1, sub, actions. **No tab bar, no tier badge in the header** (tier shows as a chip in Overview and in the sidebar profile line).

### I1. Overview — P0

"Welcome back, {first name}"; actions Book a call / Upload documents. **Your return**: 5-stage stepper (dates [BCR-02]) + next-step card (copy per stage via frontend map [BCR-03]; stage 2 = "Action needed" with CTA to e-sign). **At a glance** metrics: Documents, Messages (unread), Next call, Referrals [BCR-01]. **Recent documents** (scan chips) [BCR-01]. **Your fee**: Awaiting quote / Due (Pay $X) / Paid (View receipt [BCR-04]). **Upcoming call**: confirmed appointment with Join/Reschedule [BCR-07] or "No calls booked".

### I2. Documents — P0

Upload shell (type select, drag-drop zone, selected-file row, real size/type limits), "What we usually need" checklist, list with scan states Clean / Scanning… / Blocked, download (disabled until clean), delete (hidden and explained when the return is Ready for review or later).

### I3. Appointments — P0

Request form (format chips, date, time-window chips, topic, notes) + list grouped Upcoming/Past with status chips (Confirmed, Requested, Completed, Cancelled), Cancel request, Join call/Reschedule [BCR-07].

### I4. Referrals — P0

Hero with personal link `…/r/{code}` + Copy (+ code) (D-07 → BE-16), 3-step explainer, invite form, referrals table with statuses Invite sent / Signed up / Filed / Rewarded and earnings hint [BCR-08].

### I5. Messages — P0

Thread grouped by day, unread styling + "Mark all as read" (existing bulk route ✅), attachments [BCR-06], reply note (phone / book a call; clients still cannot reply), preparer card [BCR-06], "Staying safe" card.

### I6. Security & 2FA — P0

Gate note when 2FA is required; **three states** (Off, Setup with QR + manual key + OTP, On with recovery codes, copy, regenerate, turn off); Password form with strength meter.

### I7. Review & e-sign — P0

Step 3 of 5; prepared-return summary and forms list (what exists) [BCR-05]; Form 8879 declaration; Form 7216 consent; typed legal name; submit disabled until consent + name > 3 characters; signed confirmation card; "After you sign" timeline; "Something look wrong?".

### I8. Receipt — P0 (page exists: `portal/receipt.tsx`, route `portal.invoices.receipt`)

Restyle the existing receipt: receipt number, paid date, amount, billed-to, Print. Receipt number (`RCPT-…`) and card brand/last4 [BCR-04 ✅, BE-06, D-13]; Download PDF = print until a PDF library is approved (DR-09).

---

## J. Staff admin & settings [MOCKUP + INFERRED]

App shell with admin nav: Workspace → Clients · Leads · Referrals; Account → Settings.

- **J1 Clients:** server-side search + pagination, table (taxpayer, tier, stage, preparer, invoice), empty states. Season metrics, status/tier filters, Assigned-to-me/All tabs, Export and Invite a client are **approved and built** (BE-09) [BCR-13 ✅].
- **J2 Client detail:** stage rail with contextual actions (advance with confirm, move back with required reason), documents (infected flagged), messages composer, invoice (set amount, mark paid offline), appointments (confirm/cancel), status history, referral info, preparer assignment (existing `clients.preparer` route ✅).
- **J3 Leads:** status tabs + kind filter (server query params), rows with details/notes (existing notes route)/actions, Convert dialog with preparer select that **emails the client an invitation** (D-12), counts, search, Export [BCR-14 ✅, BE-10].
- **J4 Referrals:** paginated rows, totals strip, Ready-to-reward tab, Mark rewarded dialog (`canReward`) [BCR-15 ✅, BE-11].
- **J5 Settings:** see §N.
- Preserved from earlier spec (unchanged behavior): leads inbox actions, client detail data, return-status control with `StatusEvent` log, messaging, appointments, invoicing, referral rewards, roles/policies, audit log entries on admin reads.

---

## K. Cross-cutting features

| ID  | Feature                                                                                                                                                | Pri | Tag            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | -------------- |
| K1  | Email notifications via queued Laravel Mailables/Notifications (lead received, welcome, status change, message, appointment, referral invite, receipt) | P1  | INFERRED       |
| K2  | Payments via Laravel Cashier (Stripe Checkout one-off charge) behind "Pay Now"; `WebhookReceived` listener updates invoice                             | P1  | INFERRED       |
| K3  | E-signature flow (Form 8879 + Form 7216 consent), signed PDF stored                                                                                    | P1  | CLAIMED        |
| K4  | MFA via Laravel Fortify two-factor auth (TOTP + recovery codes), enforced by middleware                                                                | P1  | CLAIMED        |
| K5  | Password reset by email (Fortify)                                                                                                                      | P1  | INFERRED       |
| K6  | Email verification (Fortify `MustVerifyEmail`)                                                                                                         | P1  | INFERRED       |
| K7  | Audit log (sign-ins, downloads, status changes)                                                                                                        | P1  | CLAIMED (WISP) |
| K8  | Rate limiting (Laravel `RateLimiter`) + honeypot + Cloudflare Turnstile on public forms and register                                                   | P1  | INFERRED       |
| K9  | Analytics (privacy-respecting) + form conversion events                                                                                                | P2  | INFERRED       |
| K10 | Cookie/consent banner if analytics used                                                                                                                | P2  | INFERRED       |
| K11 | 404 / error pages themed to match                                                                                                                      | P1  | INFERRED       |
| K12 | Sitemap, robots, OG tags, LocalBusiness/FAQPage JSON-LD via Inertia `<Head>`; **Inertia SSR** enabled                                                  | P1  | INFERRED       |
| K13 | Session timeout (e.g. 20 min idle) on portal                                                                                                           | P1  | CLAIMED        |

---

## L. Legal pages [MOCKUP, new]

`/privacy`, `/terms`, `/security` share one template: band (chip + H1 + links between the three), sticky "On this page" TOC, draft-wording banner (counsel review required, D-06), "Last updated" + Print, numbered sections, contact line. **AC:** TOC anchors scroll; print hides chrome.

## M. Error pages [MOCKUP, new]

403, 404, 419, 500 and 503 (maintenance — rendered by the same Inertia page) on one template (403 added: D-11): code, title, text, primary and secondary actions, "Need help? Call …". Copy per status in `UI-STATE-MATRIX.md`.

## N. Settings [MOCKUP, new]

Sub-nav Profile / Security / Appearance inside the role's app shell. **Profile:** name, email (re-verification hint), plus title/office/avatar [BCR-11], delete account (danger, confirm). **Security:** password, 2FA summary + recovery codes, devices [BCR-10], passkeys ✗ [BCR-17]. **Appearance:** theme (Light / Dark / Match my system), Compact tables, Reduce motion (saved on the user's account, D-10 → BE-17).

## O. Traceability: mockup → feature → app file

| Mockup                                                                                        | Features      | App file                                               |
| --------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------ |
| home                                                                                          | A1–A3, B1–B11 | `pages/home.tsx`, `components/home/*`                  |
| services                                                                                      | E, C1, C3, C5 | `pages/services.tsx`                                   |
| pricing                                                                                       | F, C1, C3     | `pages/pricing.tsx`                                    |
| about                                                                                         | G, C2         | `pages/about.tsx`                                      |
| contact                                                                                       | D, C2         | `pages/contact.tsx`                                    |
| legal-privacy / terms / security                                                              | L             | `pages/legal/privacy.tsx`, `terms.tsx`, `security.tsx` |
| error                                                                                         | M             | `pages/error.tsx`                                      |
| auth-login / register / verify-email / 2fa / forgot / reset / confirm-password                | H1–H7         | `pages/auth/*`                                         |
| portal-overview / documents / appointments / messages / referrals / security / sign / receipt | I1–I8         | `pages/portal/*`                                       |
| admin-clients / client / leads / referrals                                                    | J1–J4         | `pages/admin/*`                                        |
| settings-profile / security / appearance                                                      | N             | `pages/settings/*`                                     |
