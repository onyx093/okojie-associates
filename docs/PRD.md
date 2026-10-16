# PRD — Okojie Online (Tax Preparation Marketing Site + Client Portal)

Confidence tags: **[OBSERVED] [INFERRED] [CLAIMED] [DRAFTED]** (see README).

## 1. Overview

**Product:** A website for *Okojie & Associates, Inc.*, a 26+-year neighborhood tax-preparation firm with 4 offices (3 Philadelphia, 1 Baltimore). The site markets a remote/hybrid service called **Okojie Online** and gives clients a **secure portal** to upload documents, track return status, book appointments, pay, refer friends, and read messages from their preparer. **[OBSERVED]**

**One-line pitch:** "The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore." **[OBSERVED]**

**Positioning:** Not a DIY software product. The differentiator is a *credentialed human preparer* plus modern convenience (portal, e-sign, e-file, video review). Trust and security are central themes.

## 2. Goals

| # | Goal | How the site serves it |
|---|---|---|
| G1 | Convert visitors to leads | Two lead forms (free quote, free consultation) on Contact; quote form repeated on Home and Services |
| G2 | Convert visitors to clients | Tier selection ("Choose X"), account creation, portal onboarding |
| G3 | Deliver the service remotely | Portal: documents, status, messages, appointments, invoice/pay |
| G4 | Build trust | Stats, credentials, security section, testimonials, videos, offices, compliance footer |
| G5 | Grow via word of mouth | Referral program ($25–$50 reward) with unique link |
| G6 | Retain / re-engage | Newsletter ("tax tips & deadlines"), year-round planning tier |

## 3. Target users

1. **W-2 households, students, gig workers, out-of-area clients** → *Upload & Go*. Want fast, remote, cheap.
2. **Families, EITC/CTC filers, first-time clients** → *Hybrid*. Want in-person reassurance and credit maximization.
3. **Self-employed, landlords, small business owners** → *Premium Remote*. Complex returns (Sched C/E, multi-state PA/MD/NJ/DE), quarterly estimates.
4. **Returning neighborhood clients** moving online (e.g. a Germantown client who "did everything online from my phone").
5. **People with IRS notices / back taxes / ITIN needs** → add-ons.
6. **[INFERRED] Internal staff** (preparers, admins) who manage returns, post messages, confirm appointments, process leads. Not shown, but required.

## 4. Scope

### In scope (v1) — matches the screenshots
- Public pages: Home, Services, Pricing, About, Contact.
- Auth: Sign in / Sign up on a single page with toggle.
- Client portal with 5 tabs: Overview, Documents, Appointments, Referrals, Messages.
- Lead capture: quote request, consultation request, newsletter subscribe, referral send.
- Content: tier cards, add-on pricing, FAQ accordions, testimonial carousel, video library (placeholders), offices, stats.
- Footer with compliance statement.
- **[INFERRED]** Minimum staff admin console to make the portal real (see below).

### In scope but not visible — build as sensible defaults **[INFERRED]**
- Staff/admin console: leads inbox, client list, return status updates, post messages, confirm appointments, review documents, set invoice amount, mark referrals rewarded.
- Transactional email (lead confirmation, appointment status, new message, referral invite).
- Payment processing behind "Pay Now".
- E-signature step (IRS Form 8879) when status = Ready for review.
- MFA enrollment/verification **[CLAIMED]**.

### Out of scope (v1)
- Actual tax calculation / return preparation software (the preparer uses their own tools; the portal only tracks status and exchanges files).
- Actual IRS/state e-file transmission (needs EFIN, MeF integration, certified software). Portal marks "E-filed" manually.
- Native mobile apps.
- Multi-language.

## 4a. Core user journeys

**J1 — New visitor → lead.** Home → reads tiers → "Start My Return Online" → Contact → fills quote form → success message → preparer follows up within one business day. **[OBSERVED copy: "follow up within one business day"]**

**J2 — Visitor → client.** Pricing/Services → "Choose Upload & Go" → Login (Sign up mode) → Create account → Portal (Overview) with tier badge → uploads docs → preparer works → status advances → e-sign → pay → e-filed.

**J3 — Returning client.** "Client Login" → Sign in → "My Portal" → check status / messages / upload more docs.

**J4 — Consultation.** Contact → "Book a free consultation" (date, time window, format) → confirmation; staff confirm.

**J5 — Referral.** Portal → Referrals → copy personal link (`/contact?ref=CODE`) or send to friend's name/email → friend files → referrer earns $25–$50.

**J6 — Self-serve info.** Visitor watches "Watch & Learn" videos, reads FAQ, compares add-ons.

## 4b. Technology constraints

The build **must** use: **Laravel 13**, **Inertia v3**, **React 19** (TypeScript), **Tailwind CSS v4**, and **shadcn/ui**. Supporting choices (Fortify auth + two-factor, Wayfinder, Cashier/Stripe, Pest, S3-compatible private storage) are specified in `SPEC.md` §1. Product requirements in this PRD are stack-independent.

## 5. Functional requirements (summary)

Full numbered list with acceptance criteria is in `FEATURES.md`. Summary:

- **Navigation** switches state by auth: logged out → "Client Login" + primary CTA "Start My Return Online"; logged in → "My Portal" + "Sign out" pill. **[OBSERVED]**
- **Three service tiers**, **five add-ons**, ranges shown as "starting at $X–$Y", copy promising "You will always know your exact price before we file — no surprises."
- **Portal status pipeline** of five stages: Intake received → In preparation → Ready for review → E-signed → E-filed.
- **Portal invoice** shows fee and "Pay Now".
- **Documents** upload by type, only visible to client and preparer.
- **Appointments** requested by date/time-window/format/topic/notes, listed per user.
- **Messages** one-way from preparer in the observed UI.
- **Referrals** with unique code and email invite form.

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| Security | Claims IRS Pub 4557 compliance, FTC Safeguards Rule WISP, MFA on every client account, IRS-compliant e-signature (Form 8879) with Form 7216 consent **[CLAIMED]**. Implementation must encrypt data in transit and at rest, enforce per-user access control (Laravel Policies), audit-log sensitive actions. See `SPEC.md` §8. |
| Privacy | Uploaded documents visible only to owner and assigned staff. |
| Performance | LCP < 2.5s on 4G for public pages; hero image optimized; lazy-load videos and below-fold images. |
| Accessibility | WCAG 2.1 AA: contrast on dark theme, visible focus, labeled inputs, keyboard accordions/carousel, `aria-expanded` on FAQ, reduced-motion support for scroll reveals. |
| SEO | **Inertia SSR** for all public pages. Title: "Okojie & Associates, Inc. — Okojie Online Tax Preparation". Meta description from the hero tagline. Local-business structured data for the 4 offices. (The original appears client-rendered, which hurts SEO; server-side rendering via Inertia SSR fixes this.) |
| Responsiveness | Desktop-first screenshots; must collapse to mobile (nav, 3→1 column grids, 4→2→1 office cards). |
| Reliability | Forms must not lose data on failure; show inline errors and success states. |
| Browser support | Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari. |

## 7. Content strategy

- Voice: reassuring, plain-English, local ("neighborhood firm", "Philadelphia and Baltimore families").
- Repeated trust phrases: "A real preparer reviews your situation", "no obligation, no pressure", "no surprises", "Your information stays private and secure".
- Social proof: 26+ years, 40,000+ returns, 12 credentialed preparers (Home only; About shows 3 stats), 4 offices.
- All copy is catalogued verbatim in `CONTENT.md`.

## 8. Success metrics

| Metric | Target (suggested) |
|---|---|
| Visitor → lead conversion | ≥ 3% |
| Lead → account creation | ≥ 35% |
| Account → first document upload within 48h | ≥ 60% |
| Median time Intake → E-filed | tracked per season |
| Portal NPS | ≥ 50 |
| Referral participation (clients who send ≥1 referral) | ≥ 10% |
| Support contact rate per return | < 15% |

## 9. Risks and open questions

1. **Regulatory:** Handling SSNs and tax returns triggers IRS (Pub 4557, Pub 1345 for e-file providers) and FTC Safeguards Rule obligations. Needs a real WISP and security review before launch.
2. **Payments:** The overview showed `$225` with "No tier selected". Decide whether invoice amount is (a) a default placeholder, (b) low end of the tier range, or (c) set by the preparer after quote. Recommended: preparer sets it; show "Pending quote" until set.
3. **MFA:** Claimed for every account, but the login form shows only email + password. Recommended: TOTP or email/SMS OTP step after password, enforced at first login.
4. **Referral reward range ($25–$50)**: define rule (e.g. $25 for Upload & Go, $50 for Hybrid/Premium) and payout method.
5. **Messages are read-only** in the observed UI. Decide whether clients can reply (recommended yes, v1.1).
6. **Newsletter** has no visible consent copy; add CAN-SPAM-compliant unsubscribe and consent text.
7. **Form 7216** consent must be captured before sharing return info with third parties; flow not visible.
8. **Seasonality:** heavy traffic Jan–Apr and around Oct 15 extension deadline; plan capacity.

## 10. Release plan

| Phase | Contents |
|---|---|
| **M1 – Marketing site** | Home, Services, Pricing, About, Contact, footer, forms → DB + email |
| **M2 – Auth + Portal shell** | Fortify sign up/in, sessions, portal tabs, tier badge |
| **M3 – Portal features** | Documents, appointments, referrals, messages, status, invoice display |
| **M4 – Staff console** | Leads, clients, status updates, messaging, appointment confirmation |
| **M5 – Money + trust** | Payments, MFA, e-sign flow, audit log |
| **M6 – Hardening** | A11y, SEO, perf, security review, backups, monitoring |