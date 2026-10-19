# Product Requirements Document: Okojie Online (Hybrid Digital Tax Service)

|                    |                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Owner**          | Okojie & Associates, Inc.                                                                       |
| **Source**         | _Okojie Online Tax Services Growth Model, 2027 Filing Season_ & Engineering Implementation Spec |
| **Target Launch**  | Early season, late Dec 2026 (build started Oct 2026)                                            |
| **Season Covered** | 2027 filing season (tax year 2026 returns)                                                      |
| **Status**         | Reconciled v1.0 — Unified Business, Product & Technical Baseline                                |

---

## 1. Overview and Executive Summary

Okojie & Associates, Inc. is an established neighborhood tax-preparation practice with 26+ years in business and four physical offices (three in Philadelphia, PA, and one in Baltimore, MD).

**Okojie Online** is the firm's new "hybrid digital" service line. It enables taxpayers to discover the firm, request quotes, book appointments, securely upload tax records, communicate with their preparer, review returns, e-sign Form 8879, and pay online—all while retaining the direct personal oversight of a credentialed human preparer (CPA / Enrolled Agent).

### 1.1 Problem Statement

- **Loss of Federal Free Options:** The discontinuation of IRS Direct File leaves millions of simple W-2 filers seeking an accessible, affordable, and trustworthy remote alternative.
- **Tax Law Complexity:** Substantial federal tax-law revisions for tax year 2026 (updated standard deductions, revised credit phaseouts, and state wage-tax adjustments) create taxpayer anxiety and heightened demand for professional advice.
- **Geographic & Physical Bottlenecks:** The firm's traditional walk-in model restricts market reach to clients willing to travel and wait in physical waiting rooms.
- **Market Failures of Alternatives:** DIY software lacks an accountable professional advocate; retail storefronts (H&R Block, Jackson Hewitt) are expensive and inconvenient; unlicensed "ghost" preparers lack security, credentials, and accountability.

### 1.2 Market Opportunity

Over 145 million individual income tax returns are e-filed annually in the United States. Local taxpayers across the Philadelphia and Baltimore metropolitan areas are already digitally literate and comfortable filing online, but seek local expertise on municipal wage taxes (Philadelphia City Wage Tax, Maryland county piggyback taxes) and IRS audit defense.

### 1.3 Positioning

> _"The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore."_

| Competitor Category                   | Okojie Online Advantage                                                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **TurboTax / H&R Block Online (DIY)** | Accountable credentialed preparer; local PA/MD municipal tax mastery; human IRS notice response.                                  |
| **Big-Box Storefronts**               | No waiting room; file from smartphone; dedicated relationship; transparent pricing; 26+ years local goodwill.                     |
| **Unlicensed "Ghost" Preparers**      | Fully credentialed (PTIN/EFIN); signed returns; encrypted client vault; FTC Safeguards/WISP compliance; year-round accessibility. |

---

## 2. Goals and Non-Goals

### 2.1 Strategic & Financial Goals (2027 Season, Base Case)

| Objective                                    | Target Metric   |
| -------------------------------------------- | --------------- |
| **Net New Online/Hybrid Clients**            | **400 clients** |
| **Incremental Gross Revenue**                | **~$113,000**   |
| **Net Operating Contribution**               | **~$71,800**    |
| **First-Year ROI (Net Contribution ÷ Cost)** | **~1.7x**       |
| **Client Retention into 2028 Season**        | **70%**         |

### 2.2 Operational & Conversion Goals

- **G1 (Lead Conversion):** Convert ≥ 5% of unique site visitors to qualified leads via Contact and tier quote forms.
- **G2 (Onboarding Efficiency):** Ensure ≥ 80% of registered clients complete initial document uploads within 48 hours.
- **G3 (Turnaround Speed):** Maintain an average cycle time of < 5 days from document completion to e-filing.
- **G4 (Referral Virality):** Achieve ≥ 25% client participation in the referral program ($25–$50 incentive).
- **G5 (Compliance & Trust):** 100% adherence to IRS Pub 4557, FTC Safeguards Rule, and mandatory MFA adoption.

### 2.3 Non-Goals

- **Replacing Physical Offices:** Physical offices remain operational for walk-in clients and clients uncomfortable with technology.
- **Proprietary Tax Calculation Software:** The firm will not engineer an internal tax calculation engine; preparers use professional desktop tools (Drake, ProConnect).
- **Automated Filing without Human Oversight:** No automated algorithms file returns directly to the IRS; every return is reviewed and signed by a credentialed preparer.
- **National Expansion in v1:** Marketing and service focus remains strictly targeted on Pennsylvania, Maryland, Delaware, and New Jersey.

---

## 3. Target User Personas

| Persona                                         | Description & Needs                                                                                                               | Primary Tier       |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **W-2 Filers & Former Direct File Users**       | Students, young professionals, gig workers with single/dual W-2s seeking fast, low-cost filing without visiting an office.        | **Upload & Go**    |
| **Working Families & Credit Claimants**         | EITC, Child Tax Credit, and education credit claimants needing guidance, deduction maximization, and optional phone/video review. | **Hybrid**         |
| **Small Businesses & Independent Contractors**  | Landlords, LLC owners, 1099 contractors, multi-state filers (PA/MD/NJ/DE) requiring Schedule C/E and year-round tax planning.     | **Premium Remote** |
| **Returning & Lapsed Neighborhood Clients**     | Long-standing clients of the firm's physical offices (2023–2025) transitioning to mobile or remote filing.                        | **All Tiers**      |
| **Internal Staff (Preparers & Administrators)** | Credentialed CPAs/EAs managing client queues, assigning preparers, updating return statuses, and reviewing documents.             | **Staff Console**  |

---

## 4. Service Tiers, Pricing, and Add-ons

_Transparent pricing displayed as "Starting at $X–$Y"; clients receive an exact quote prior to preparation._

| Tier                                      | Workflow & Inclusions                                                                                                                                                      | Fee Range        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **Upload & Go** _(Fully Remote)_          | Self-service intake → secure portal upload → preparer builds return → phone/video review → e-sign → e-file → pay online.                                                   | **$150 – $225**  |
| **Hybrid** _(Remote + Office)_            | Document drop-off or portal upload; in-person or video return review; comprehensive credit due diligence (Form 8867).                                                      | **$225 – $350**  |
| **Premium Remote** _(Complex & Business)_ | Dedicated senior preparer; Schedule C/E; multi-state allocation (PA/MD/NJ/DE); quarterly estimates; year-round planning.                                                   | **$400 – $900+** |
| **Add-ons** _(All Tiers)_                 | Prior-year amendments ($150–$300), IRS/State notice response ($100–$400), ITIN applications ($150–$250), Bookkeeping clean-up ($250–$500), Quarterly estimates ($75–$150). | **$75 – $500**   |

---

## 5. Core User Journeys

- **Journey 1: Visitor → Lead (Quote Request):**  
  Visitor arrives on Home/Services → Reviews tiers → Clicks "Start My Return Online" → Completes quote form on Contact → Honeypot and Turnstile pass → Receives confirmation email → Staff review inquiry within 1 business day.
- **Journey 2: Visitor → Client Onboarding:**  
  Visitor clicks "Choose Upload & Go" → Unified access page (`/login?mode=signup`) → Registers account → Default current-year `TaxReturn` initialized → Enters portal → Enforces 2FA enrollment → Uploads W-2/1099 documents.
- **Journey 3: Document Upload → Review & E-Sign:**  
  Preparer builds return → Advances status to `Ready for Review` → Client receives notification → Client logs in, views return summary, reads mandatory Form 7216 disclosure consent, types full name, and e-signs → Status advances to `E-Signed`.
- **Journey 4: Invoice Payment & E-Filing:**  
  Preparer sets invoice amount → Client clicks "Pay Now" → Redirects to hosted Stripe Checkout → Webhook reconciles payment idempotently → Client downloads receipt → Preparer marks return `E-Filed`.
- **Journey 5: Client Referral Program:**  
  Client visits Referrals tab in portal → Copies personal link (`/contact?ref=OKJ-XXXXXX`) or enters friend's email → Friend visits via link (sets 30-day cookie) and registers → Upon friend's return filing, referrer is credited $25–$50 reward.
- **Journey 6: Consultation Booking:**  
  Visitor selects "Book a Free Consultation" → Selects preferred date, time window (Morning/Afternoon/Evening), and format (Video/Phone/In-person) → Appointment logged in status `Requested` → Staff confirm slot.

---

## 6. Functional Requirements

### 6.1 Client-Facing Requirements

| ID        | Requirement Description                                                                                                                                      | Priority | Feature Ref          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | -------------------- |
| **FR-1**  | Mobile-first marketing website with prominent "Start My Return Online" CTAs, tier breakdowns, and localized city office coverage (Philadelphia & Baltimore). | P0       | `FEATURES.md` A1–B9  |
| **FR-2**  | 24/7 online appointment booking with format selection (video, phone, in-person) and time-window choices.                                                     | P0       | `FEATURES.md` I3     |
| **FR-3**  | Secure client portal with multi-file drag-and-drop document upload (W-2, 1099, IDs) and private storage.                                                     | P0       | `FEATURES.md` I2     |
| **FR-4**  | IRS-compliant e-signature workflow capturing Form 7216 consent, typed signature, IP address, and timestamp.                                                  | P0       | `FEATURES.md` K1–K2  |
| **FR-5**  | Online payment integration via hosted Stripe Checkout for tax preparation fees, with receipt downloads.                                                      | P0       | `FEATURES.md` J1–J2  |
| **FR-6**  | Video/phone review coordination with credentialed preparers.                                                                                                 | P0       | `FEATURES.md` I3, I5 |
| **FR-7**  | Automated email status notifications upon return stage transitions and appointment status updates.                                                           | P1       | `FEATURES.md` G1–G3  |
| **FR-8**  | Interactive tier selector and quote estimation during client portal intake.                                                                                  | P1       | `FEATURES.md` I1     |
| **FR-9**  | Client education library ("Watch & Learn" video modals) and phone support line.                                                                              | P1       | `FEATURES.md` B6     |
| **FR-10** | Referral engine with unique referral links, email invites, 30-day cookie attribution, and reward tracking.                                                   | P1       | `FEATURES.md` I4     |
| **FR-11** | Post-season client feedback and Google review prompt link.                                                                                                   | P1       | `FEATURES.md` B5     |
| **FR-12** | Direct File replacement messaging with dedicated lead capture options.                                                                                       | P0       | `FEATURES.md` B1, C1 |

### 6.2 Firm-Facing / Back-Office Requirements

| ID        | Requirement Description                                                                                                | Priority | Feature Ref      |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ---------------- |
| **FR-13** | Integration with professional tax software workflows and bank-product tracking.                                        | P0       | `FEATURES.md` M4 |
| **FR-14** | Staff leads inbox with status filters, preparer notes, and one-click lead-to-client conversion.                        | P0       | `FEATURES.md` M1 |
| **FR-15** | Digital Form 8867 due-diligence verification and document validation checklist.                                        | P0       | `FEATURES.md` M2 |
| **FR-16** | Antivirus scanning (ClamAV) and private document inspection for client uploads.                                        | P0       | `FEATURES.md` I2 |
| **FR-17** | Return status management across 7 pipeline states with mandatory reversal reasons.                                     | P1       | `FEATURES.md` M3 |
| **FR-18** | Preparer assignment scoping ensuring preparers only view assigned clients while admins view all.                       | P0       | `FEATURES.md` M2 |
| **FR-19** | Complete immutable audit logging (`audit_logs`) recording every administrative view, file download, and status change. | P1       | `FEATURES.md` M5 |

---

## 7. Technology Stack & Implementation Architecture

The application is implemented as a unified Laravel monolithic application with Inertia.js v3 and React 19:

- **Backend Framework:** Laravel 12.x running on PHP 8.5.
- **Frontend / Client Layer:** Inertia.js v3 with React 19 and TypeScript.
- **Styling & UI Primitives:** Tailwind CSS v4, `shadcn/ui` (Radix primitives), and custom dark theme design tokens.
- **Type Safety & Routing:** Laravel Wayfinder generating TypeScript route helpers (`@/routes/*`), eliminating hardcoded URLs.
- **Authentication & Security:** Laravel Fortify (session auth, Argon2id hashing, RFC 6238 TOTP MFA, WebAuthn passkeys).
- **Payment Processing:** Laravel Cashier (Stripe Checkout and webhook listeners).
- **Document Vault:** Private storage disk (`storage/app/private/documents/`) with asynchronous ClamAV virus scanning.
- **Server-Side Rendering:** Inertia SSR daemon running on Node.js (port 13714) for fast LCP (< 2.5s) and full search indexing.
- **Testing:** Pest PHP test runner with automated policy coverage, security header tests, and axe accessibility auditing.

---

## 8. Compliance, Security, and Non-Functional Standards

- **Written Information Security Plan (WISP):** Compliant with FTC Safeguards Rule (16 CFR Part 314) and IRS Publication 4557 (documented in `docs/WISP-TEMPLATE.md`).
- **IRC § 7216 Affirmative Consent:** Verbatim statutory disclosure language presented to clients prior to e-signature submission.
- **Mandatory MFA Enforcement:** `EnsureTwoFactorEnabled` middleware blocks client and staff access to portal features until TOTP is confirmed.
- **Content Security Policy (CSP):** Strict script nonces with whitelists restricted to Stripe and Cloudflare Turnstile.
- **Accessibility:** WCAG 2.1 Level AA conformance across all public marketing and portal components.
- **SEO & Search Visibility:** Complete Open Graph metadata, dynamic XML sitemap (`/sitemap.xml`), and `robots.txt` disallow rules on authenticated routes.

---

## 9. Go-to-Market and Acquisition Plan

### 9.1 Funnel Projections (2027 Season Base Case)

| Channel                                          | Marketing Budget       | Projected Leads | Modeled Close Rate | Acquired Clients           |
| ------------------------------------------------ | ---------------------- | --------------- | ------------------ | -------------------------- |
| **Google Business Profile (Philly & Baltimore)** | $0                     | 180             | 40%                | 72                         |
| **Google Search Ads (High Intent)**              | $4,800 ($1,200 × 4 mo) | 320             | 30%                | 96                         |
| **Social Media Ads (Meta / TikTok)**             | $3,200 ($800 × 4 mo)   | 144             | 25%                | 36                         |
| **Client Referral Program**                      | ~$5,000                | 200             | 50%                | 100                        |
| **Direct File Replacement Campaign**             | $1,000                 | 150             | 30%                | 45                         |
| **Community & Employer Partnerships**            | $1,500                 | 120             | 40%                | 48                         |
| **Prior-Client Reactivation (Lapsed 2023–2025)** | $300                   | 100             | 35%                | 35                         |
| **Total / Net**                                  | **~$15,800 – $17,800** | **~1,214**      | **~35% (avg)**     | **~432 modeled → 400 net** |

### 9.2 Six-Phase Implementation Timeline

| Phase                                 | Timeframe                | Core Focus & Milestones                                                                           |
| ------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| **Phase 1: Build & Scaffold**         | Oct – Nov 2026           | Application build, WISP update, Stripe integration, MFA gate, and staff console release.          |
| **Phase 2: Preseason Setup**          | Nov – mid-Dec 2026       | Google Business Profile refresh, 50 client reviews, referral engine kickoff, reactivation emails. |
| **Phase 3: Early Season Launch**      | Late Dec 2026 – Jan 2027 | "Direct File is Gone" marketing launch, paid search activation, early document upload intake.     |
| **Phase 4: Peak Season Execution**    | Late Jan – Feb 2027      | Maximum ad spend, 1-hour lead follow-up SLA, evening/weekend video review slots.                  |
| **Phase 5: Late Season & Extensions** | Mar – Apr 15, 2027       | Self-employed marketing push, extension processing, Premium Remote upselling.                     |
| **Phase 6: Retention & Year-Round**   | May – Sep 2027           | Satisfaction surveys, bookkeeping upselling, quarterly estimates, 2028 renewal planning.          |

---

## 10. Financial Model and Unit Economics

| Financial Metric                        | Conservative Case | **Base Case (Target)** | Aggressive Case |
| --------------------------------------- | ----------------- | ---------------------- | --------------- |
| **New Online/Hybrid Clients**           | 200               | **400**                | 700             |
| **Blended Average Preparation Fee**     | $240              | **$260**               | $275            |
| **Core Preparation Revenue**            | $48,000           | **$104,000**           | $192,500        |
| **Add-on Revenue (15% attach × $150)**  | $4,500            | **$9,000**             | $15,750         |
| **Gross Revenue**                       | **$52,500**       | **$113,000**           | **$208,250**    |
| Marketing & Acquisition Spend           | $10,000           | $17,800                | $28,000         |
| Software, Hosting & Portals             | $4,500            | $6,000                 | $8,500          |
| Seasonal Preparer & Admin Labor         | $8,000            | $14,000                | $35,000         |
| Payment Processing Fees (~3%)           | $1,600            | $3,400                 | $6,250          |
| **Total Operating Costs**               | **$24,100**       | **$41,200**            | **$77,750**     |
| **Net Contribution**                    | **$28,400**       | **$71,800**            | **$130,500**    |
| **ROI (Net Contribution ÷ Total Cost)** | **1.2x**          | **1.7x**               | **1.7x**        |

---

## 11. Operational KPIs and Weekly Metrics

| KPI                                   | Target      | Owner            | Review Cadence |
| ------------------------------------- | ----------- | ---------------- | -------------- |
| **Cost Per Inbound Lead**             | < $15.00    | Marketing        | Weekly         |
| **Cost Per Acquired Client (CAC)**    | < $45.00    | Marketing        | Weekly         |
| **Portal Onboarding Completion Rate** | > 80%       | Operations       | Weekly         |
| **Intake to E-File Cycle Time**       | < 5 days    | Lead Preparer    | Weekly         |
| **Customer Review Rating (Google)**   | ≥ 4.7 / 5.0 | Office Admin     | Weekly         |
| **Referral Share of New Leads**       | ≥ 25%       | Growth           | Bi-weekly      |
| **Year-Two Client Retention**         | ≥ 70%       | Managing Partner | Annual         |

_Decision Rule: If an acquisition channel's CAC exceeds $55 after Week 3 of tax season, reallocate remaining ad spend to top-performing search or referral channels._

---

## 12. Strategic Analysis of Open Issues & Model Assumptions

1. **Marketing Budget Variance ($15,800 vs. $17,800):**  
   The individual line items in the Growth Model sum to $15,800 ($4,800 search + $3,200 social + $5,000 referral + $1,000 Direct File + $1,500 partnerships + $300 reactivation), whereas the summary model cites $17,800. This $2,000 discrepancy acts as an unallocated contingency buffer. If expenses hold at $15,800, net operating contribution increases to ~$73,800.
2. **Long-Term Lifetime Value (LTV):**  
   The source model projects "$300,000+" in cumulative future fees from 400 clients at 70% retention over 4–6 years. At a flat $260 base fee, geometric decay yields ~$185,000–$200,000. Achieving $300,000+ requires either annual price increases of 4–5% or active cross-selling of business add-ons (quarterly estimates and bookkeeping).
3. **ROI Definition Alignment:**  
   The 1.7x target represents Net ROI (`$71,800 net contribution ÷ $41,200 total cost`). When measured as Gross Revenue ROI (`$113,000 ÷ $41,200`), the multiple is ~2.7x. Stakeholder communications must consistently specify Net ROI.
4. **Funnel Lead Buffer:**  
   The acquisition funnel models 432 gross acquired clients to achieve a net target of 400, providing an intentional 7.4% buffer against drop-off during intake.
5. **Multi-State Tax Licensing:**  
   The Premium Remote tier supports filers across PA, MD, NJ, and DE. Preparer software subscriptions and city wage tax filing capabilities (Philadelphia Form BIRT/NPT) must be re-verified annually by December 1.

---

## 13. Related Documentation

- Detailed Technical Implementation: `docs/TECHNICAL_DOCUMENTATION.md`
- Feature Acceptance Criteria Inventory: `docs/FEATURES.md`
- Architectural Decision Records: `docs/DECISIONS.md`
- Written Information Security Plan: `docs/WISP-TEMPLATE.md`
- Design Tokens & Layout System: `docs/DESIGN_SYSTEM.md`
- Copy & Messaging Matrix: `docs/CONTENT.md`
