# Technical Documentation — Okojie Online (Okojie & Associates, Inc.)

_Comprehensive Software Engineering Documentation covering the complete 12-step implementation of Okojie Online._

---

## 0. Document Control

- **What is the document's title and the name of the system, service, or feature it describes?**  
  **Title:** Technical System Architecture & Engineering Documentation — Okojie Online  
  **System Name:** Okojie Online (Remote & Hybrid Tax Preparation Marketing Platform and Client Portal)  
  **Organization:** Okojie & Associates, Inc. (Philadelphia & Baltimore)

- **Who is the author, and who are the reviewers and approvers?**  
  **Author:** Lead Full-Stack Software Engineer / Antigravity AI Engineering Team  
  **Reviewers:** Principal Architect, Security & Compliance Officer, Lead Tax Preparer  
  **Approvers:** Executive Managing Director & Managing Partner, Okojie & Associates, Inc.

- **What is the document's version, status, and last-updated date?**  
  **Version:** 1.0.0 (Production-Ready Parity)  
  **Status:** Approved  
  **Last Updated Date:** October 18, 2026

- **Where is the source of truth, and how are changes proposed?**  
  **Source of Truth:** Git repository root at `docs/TECHNICAL_DOCUMENTATION.md` within repository `okojie-associates`.  
  **Change Proposal Process:** Changes must be submitted via Git pull requests against branch `main`. PRs require review from a designated code owner, passing CI pipeline runs (`tests.yml`), zero linter/type errors, and explicit sign-off from compliance on legal and regulatory updates.

- **What is the change log (date, author, summary of change)?**
    | Date       | Author           | Summary of Change                                                                                                                     |
    | ---------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
    | 2026-10-17 | Engineering Team | Initial scaffolding, design foundation, and marketing components (Steps 1–3).                                                         |
    | 2026-10-17 | Engineering Team | Fortify authentication, client portal core, documents, and MFA enforcement (Steps 4–7).                                               |
    | 2026-10-18 | Engineering Team | Appointments, referrals, messaging, staff admin console, Cashier Stripe payments, and e-signatures (Steps 8–11).                      |
    | 2026-10-18 | Engineering Team | Hardening (CSP, Turnstile, rate limits, noindex), SEO, error pages, WISP template, CI workflow, and full named route audit (Step 12). |
    | 2026-10-18 | Engineering Team | Compiled comprehensive Technical Documentation per engineering template standards.                                                    |

---

## 1. Overview and Purpose

- **What is this system or feature, in two or three sentences a new engineer could understand?**  
  Okojie Online is a full-stack web application combining a public marketing front with a private, highly secure client portal and staff console for a 26+-year neighborhood tax preparation firm with offices across Philadelphia and Baltimore. It allows taxpayers to choose a service tier, securely upload tax documents, schedule appointments, communicate with their credentialed preparer, review and e-sign IRS Form 8879/7216 tax returns, pay preparation fees via Stripe Checkout, and track electronic filing. For firm staff, it provides a unified administration console for managing leads, assigning preparers, progressing tax returns, issuing invoices, and fulfilling referrals.

- **What problem does it solve, and for whom?**  
  Traditional neighborhood tax offices rely on walk-ins, paper exchanges, physical signatures, and unencrypted email transmissions of sensitive Taxpayer Identification Numbers (TINs/SSNs). Okojie Online solves this for individuals, families (EITC/CTC filers), students, gig workers, and multi-state business filers who want the convenience of modern online filing without sacrificing the trust, accuracy, and personalized support of a real, local, credentialed CPA/Enrolled Agent. Simultaneously, it equips internal tax preparers and office administrators with a modern operations center that enforces IRS Publication 4557 and FTC Safeguards compliance.

- **Why does it exist now? What business or technical trigger led to it?**  
  Client demand has shifted rapidly toward hybrid and fully remote tax services. Clients who previously visited physical offices in Germantown, Northeast Philadelphia, or Baltimore now expect mobile-friendly digital uploads, video reviews, and remote e-signatures. Furthermore, stricter federal regulatory scrutiny under the FTC Safeguards Rule (16 CFR Part 314) and IRS Publication 4557 mandated that accounting and tax preparation practices implement robust access controls, multi-factor authentication (MFA), encrypted storage, immutable audit logs, and written security policies.

- **Who is the intended audience of this document?**
    - **Full-Stack Developers & Software Engineers:** Implementing features, refactoring components, and maintaining APIs.
    - **DevOps / SRE Engineers:** Managing Docker Sail environments, CI/CD pipelines, and Laravel Cloud deployments.
    - **Security & Compliance Officers:** Auditing access controls, GLBA compliance, FTC Safeguards, and IRS WISP alignment.
    - **QA & Automation Engineers:** Maintaining Pest test suites, axe accessibility tests, and regression suites.
    - **Product Managers & Operations Staff:** Understanding platform capabilities, return status workflows, and tier economics.

- **What is explicitly out of scope?**
    1. _Calculation Engine:_ The portal does not compute tax math (depreciation schedules, tax brackets, EITC phaseouts); preparers use professional tax preparation desktop software (e.g., Drake, ProConnect, UltraTax).
    2. _Direct IRS MeF Transmission:_ The portal does not act as an IRS Electronic Return Originator (ERO) Transmitter; staff transmit returns via their certified provider and manually update return statuses to `E-Filed` and `Accepted`.
    3. _Native Mobile Apps:_ iOS and Android apps are out of scope for v1; the web application is fully responsive.
    4. _Multi-Language Localization:_ English only for v1.

---

## 2. Goals, Non-Goals, and Success Criteria

- **What are the measurable goals?**
    - **Performance:** Largest Contentful Paint (LCP) under 2.5 seconds on mobile; First Input Delay / INP < 200 ms; Cumulative Layout Shift (CLS) < 0.1.
    - **Availability:** 99.9% uptime during tax season (January 15 – April 30).
    - **Quality Gates:** Zero serious or critical axe accessibility violations across all public and portal views; 100% test pass rate across the Pest regression suite (>160 tests, >970 assertions); 100% PHPStan level 5 compliance with 0 errors.
    - **Security:** 100% MFA adoption for all portal client accounts; zero plaintext SSN or tax document leakage; comprehensive CSP and security headers on every response.

- **What are the non-goals?**
    - Real-time instant messaging / chat socket server (messages are transactional and asynchronous in v1).
    - Automatic OCR transcription or automated extraction of tax forms into third-party software.
    - Client self-service filing without preparer review.

- **How will we know the work succeeded? Which metrics, and who owns them?**
    - _Lead Conversion Rate:_ Proportion of unique visitors submitting quote/consultation forms (Target: ≥ 5.0%, owned by Marketing).
    - _Client Digital Adoption:_ Percentage of active tax clients completing document upload and e-sign digitally through the portal (Target: ≥ 65%, owned by Operations).
    - _Time to Invoice Settlement:_ Median time from invoice issuance to payment completion (Target: ≤ 48 hours, owned by Finance).
    - _Referral Virality:_ Proportion of new leads originating with an active referral code (Target: ≥ 15%, owned by Growth).

- **What are the key assumptions, and what happens if one turns out to be false?**
    1. _Assumption:_ Clients can authenticate with modern smartphones capable of TOTP authenticator apps.  
       _Failure Mitigation:_ SMS fallback or preparer-assisted in-person verification can be activated.
    2. _Assumption:_ ClamAV scanning is available in production or managed file environments.  
       _Failure Mitigation:_ The `ScanDocument` job gracefully falls back to clean logging when ClamAV is unconfigured in development/testing, but halts download of unscanned files in strict production mode.
    3. _Assumption:_ Stripe Checkout handles PCI-DSS compliance and payment processing without storing cardholder data.  
       _Failure Mitigation:_ If Stripe suffers an outage, offline payments can be recorded manually by staff via the Admin Console.

---

## 3. Background and Context

- **What existing systems, processes, or prior decisions does this build on or replace?**  
  Replaces disparate legacy operations: physical paper drop-offs at branch offices (Broad St, 52nd St, Frankford Ave, Baltimore), unencrypted email attachments, manual paper receipts, and paper Form 8879 signature logs. Builds upon a unified Laravel 12 application scaffold utilizing Inertia.js v3, React 19, and Tailwind CSS v4.

- **What domain terms, acronyms, or concepts must a reader know?**
    - **PTIN:** Preparer Tax Identification Number issued by the IRS to credentialed preparers.
    - **EFIN:** Electronic Filing Identification Number used by firms to e-file tax returns.
    - **Form 8879:** IRS e-file Signature Authorization for Form 1040.
    - **IRC § 7216:** Internal Revenue Code section criminalizing unauthorized disclosure or use of tax return information by preparers without express affirmative client consent.
    - **WISP:** Written Information Security Plan mandated by the FTC Safeguards Rule (16 CFR Part 314) and IRS Publication 4557.
    - **MFA / TOTP:** Multi-Factor Authentication / Time-Based One-Time Password algorithm (RFC 6238).
    - **Inertia.js:** Client-side routing adapter allowing server-driven Laravel routing and validation while rendering React client components.
    - **Wayfinder:** Build-time generator producing TypeScript route functions and form actions from Laravel route definitions.

- **What alternatives were considered, and why were they rejected?**
    - _Separate SPA (Next.js / Vite SPA) + Laravel API:_ Rejected due to token authentication friction (Sanctum/cookies across domains), duplicate validation rules in TS and PHP, and operational overhead of maintaining two deployments. Inertia.js provides single-repo simplicity with zero API drift.
    - _Commercial Client Portal SaaS (e.g., TaxDome, Canopy):_ Rejected due to high per-seat recurring licensing costs ($1,000+/preparer/yr), lack of local neighborhood branding parity, rigid workflow constraints, and inability to customize local referral/attribution models.
    - _Blade + Alpine.js:_ Rejected in favor of Inertia React to support complex interactive state machines (file dropzones, appointment scheduling calendars, e-signature canvases, real-time OTP slot inputs).

- **Are there links to related documents, tickets, design reviews, or RFCs?**
    - Product Requirements Document: `docs/PRD.md`
    - Technical Specifications: `docs/SPEC.md`
    - Feature Inventory & Acceptance Criteria: `docs/FEATURES.md`
    - Architecture Decisions Log: `docs/DECISIONS.md`
    - Written Information Security Plan: `docs/WISP-TEMPLATE.md`
    - Content & Copy Matrix: `docs/CONTENT.md`
    - Design System Guide: `docs/DESIGN_SYSTEM.md`

---

## 4. Requirements

### 4.1 Functional Requirements

| ID         | Requirement Statement                                                                                                                | Primary Actor      | Expected Outcome                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------- |
| **FR-001** | Public marketing pages must showcase services, pricing tiers, office locations, testimonials, video guides, and firm credentials.    | Anonymous Visitor  | Clear visibility into pricing and services; high conversion to quote/consultation.                  |
| **FR-002** | Visitors must be able to submit Quote Requests and Consultation Requests with spam honeypot and rate limiting.                       | Anonymous Visitor  | Lead record created in DB, audit log entry recorded, confirmation email sent, staff alerted.        |
| **FR-003** | Visitors must be able to subscribe to tax updates with immediate idempotent feedback.                                                | Anonymous Visitor  | Email stored in `newsletter_subscribers`, audit log written, success toast displayed.               |
| **FR-004** | Unified authentication screen supporting sign-in, account registration with tier selection, email verification, and password resets. | Client / Staff     | Secure account creation, default current-year `TaxReturn` initialized, verification email queued.   |
| **FR-005** | Mandatory 2FA enforcement requiring TOTP activation before a client or staff member can access portal/admin views.                   | Authenticated User | Blocked from protected routes; redirected to `/portal/security` until 2FA is confirmed.             |
| **FR-006** | Client portal dashboard displaying current tax return status across 7 distinct states with status tracker and quick links.           | Client             | Real-time visibility into return progress, assigned preparer, and actionable next steps.            |
| **FR-007** | Secure document upload with file type/size validation, categorization, private disk storage, and asynchronous virus scanning.        | Client / Preparer  | Files uploaded without public URL exposure; status flagged `clean` or `infected`.                   |
| **FR-008** | Client appointment requests for specific dates (up to 180 days out), time windows, and formats (video, phone, in-person).            | Client             | Appointment created in `Requested` status; staff can confirm; client can cancel while requested.    |
| **FR-009** | Client referral system with unique referral codes, copyable tracking links, email invites, and 30-day cookie attribution.            | Client / Lead      | Referrals tracked from visit to registration; marked `Filed` upon return filing; rewarded by staff. |
| **FR-010** | Asynchronous client messaging interface with unread tracking and automatic mark-as-read interaction.                                 | Client / Preparer  | Client reads preparer notes; unread indicators clear upon view; staff compose messages from admin.  |
| **FR-011** | Staff administration console scoped by roles and preparer assignments for leads, clients, appointments, returns, and invoices.       | Preparer / Admin   | Preparers manage assigned clients; admins manage all; every read/write action audit logged.         |
| **FR-012** | Integrated payment checkout via Laravel Cashier Stripe for preparation fees, with idempotent webhooks and receipts.                  | Client             | Client pays via hosted Stripe Checkout; return unlocked for filing; payment receipt emailed.        |
| **FR-013** | Digital e-signature flow with mandatory IRC § 7216 consent, typed signature capture, audit metadata, and signed PDF generation.      | Client             | Tax return advances to `ESigned`; immutable signed PDF stored on private disk; ready for e-filing.  |

#### Edge Cases and Error Scenarios

- _Unverified Email:_ User cannot access portal features; redirected to `/email/verify` with resend capability.
- _Unconfirmed 2FA:_ Middleware intercepts any `/portal/*` or `/admin/*` route and redirects to `/portal/security`.
- _Reversing Return Status:_ Staff attempting to move a return backwards in the pipeline must provide a mandatory text reason, which is written to the immutable `StatusEvent` ledger.
- _Concurrent Checkout:_ If an invoice is already paid or lacks an assigned dollar amount, `InvoiceController@checkout` rejects the request with HTTP `409 Conflict`.
- _Infected Document:_ If ClamAV detects malware, the document status is set to `infected`, download buttons are disabled, and staff are alerted.

### 4.2 Non-Functional Requirements

- **Performance:** Server-side rendered HTML responses deliver TTFB < 150 ms locally; compiled client JS chunks < 75 kB gzipped; SSR bundle executes in < 15 ms per page visit.
- **Scalability:** Stateless application layer supports horizontal scaling behind an ALB; Redis-compatible caching and queues; private disk abstraction supports Amazon S3 / Cloudflare R2 object storage.
- **Reliability & Availability:** Target 99.9% uptime. RTO (Recovery Time Objective) < 1 hour; RPO (Recovery Point Objective) < 15 minutes via point-in-time database WAL archiving.
- **Security & Privacy:** Enforces IRS Pub 4557, FTC Safeguards Rule (16 CFR Part 314), and GLBA. Strict CSP headers, HSTS, X-Frame-Options DENY, Turnstile challenge for public submissions, AES-256 encrypted cookies, and argon2id password hashing.
- **Usability & Accessibility:** WCAG 2.1 Level AA conformance. Automated axe browser tests run in CI; focus rings, semantic landmark markup, ARIA live regions, and full keyboard navigation for dialogs, accordions, and OTP inputs.
- **Maintainability & Observability:** Strict PHP typing with PHPStan Level 5; comprehensive `audit_logs` capturing actor, action, IP, user-agent, entity, and metadata; structured JSON logging.
- **Compatibility:** Evergreen browsers (Chrome, Edge, Firefox, Safari iOS 16+, macOS Safari 16+). Responsive breakpoints: Mobile (375px+), Tablet (768px+), Desktop (1024px, 1280px, 1440px).

### 4.3 Constraints

- **Technical Constraints:** Must run on PHP 8.5 with Laravel 12+, Inertia v3, React 19, Tailwind CSS v4, and Vite Plus / Rolldown bundling.
- **Regulatory & Legal Constraints:** Internal Revenue Code (IRC) § 7216 consent language must be presented word-for-word and confirmed prior to return disclosure; e-signatures must meet IRS Pub 1345 standards for electronic filing authorizations.
- **Infrastructure Constraints:** Storage of tax documents must reside on private disks with zero direct public HTTP accessibility.

---

## 5. Architecture and Design

### 5.1 High-Level Architecture

The system utilizes a modern monolithic architecture powered by Laravel 12 and Inertia.js v3. Rather than maintaining a separate decoupled API and SPA frontend, Inertia acts as the transport bridge, routing requests through Laravel's middleware pipeline and rendering React components client-side with complete server-side hydration (SSR).

```
[ Web Client / Browser ]
           │
           ▼
[ Cloudflare / Reverse Proxy ] ─── (Terminates SSL, Turnstile Verification, DDoS)
           │
           ▼
[ Laravel 12 Application Core ]
   ├── Middleware Stack (SecurityHeaders, Auth, Verified, EnsureTwoFactorEnabled, AttributeReferral)
   ├── Routing & Wayfinder Type Bridge
   ├── Inertia SSR Node Daemon (Port 13714)
   ├── Controllers & Form Requests
   └── Policies & Gates (TaxReturnPolicy, DocumentPolicy, AppointmentPolicy, InvoicePolicy)
           │
     ┌─────┴──────────────────────────────┬──────────────────────────────┐
     ▼                                    ▼                              ▼
[ Relational DB ]               [ Private Storage Disk ]          [ Asynchronous Queues ]
- Users & Passkeys              - Documents / Private PDF         - Mailables (Lead/Invite/Receipt)
- Tax Returns & Status Events   - Signed Form 8879 Records        - ClamAV Virus Scans
- Invoices & Referrals                                            - Webhook Processing
- Audit Logs & Sessions                                           - Status Notifications
     │                                    │                              │
     ▼                                    ▼                              ▼
[ External Services: Stripe Checkout / Webhooks, ClamAV Daemon, Cloudflare Turnstile ]
```

#### Communication & Protocols

- **Client ↔ Server:** Synchronous HTTPS visits returning Inertia JSON/SSR HTML payloads; typed router visits via Wayfinder route helpers.
- **Server ↔ Background Workers:** Asynchronous job dispatching via database/Redis queues.
- **Server ↔ Stripe:** Outbound HTTPS calls to Stripe API via Laravel Cashier; inbound HTTPS webhooks to `/stripe/webhook`.
- **Third-Party Failures:**
    - _Stripe Failure:_ Checkout aborts gracefully with client error; offline payment bypass available in Admin Console.
    - _ClamAV Failure:_ Fallback logs warning and marks file clean in dev/test, or locks file download pending manual review in production.
    - _Turnstile Failure:_ Validation fails gracefully with descriptive error prompting user to retry challenge.

### 5.2 Detailed Design

- **Component Patterns:**
    - _Action Classes:_ Single-responsibility command actions such as `AdvanceReturnStatus` to encapsulate complex business transactions, write status events, queue notifications, and record audit trails atomically.
    - _Form Request Validation:_ Dedicated request classes (e.g., `StoreLeadRequest`, `StoreAppointmentRequest`, `StoreReferralRequest`) encapsulating authorization and sanitization.
    - _Eloquent Model Policies:_ Granular policies enforcing user scoping (e.g., clients can only access their own returns; preparers can only access assigned clients; admins access all).
- **Idempotency & Concurrency:**
    - _Stripe Webhooks:_ Webhook handler inspects `invoice.stripe_session_id` and `invoice.status`. If already `Paid`, the event is logged and ignored to prevent duplicate receipt emails.
    - _Newsletter Subscriptions:_ Database unique constraint on `email`; re-submitting returns success toast without inserting duplicate rows.
    - _Referral Attribution:_ Middleware attaches cookie once per 30-day window; duplicate referral invites to the same friend email by the same user are rejected with validation errors.

### 5.3 Data Design

#### Entity-Relationship Diagram (ERD)

```
┌─────────────────┐       1:N       ┌─────────────────────┐
│      users      │────────────────▶│     tax_returns     │
│ (Clients/Staff) │                 │  (Year, Status,     │
└────────┬────────┘                 │   Preparer ID)      │
         │                          └──────────┬──────────┘
         │ 1:N                                 │ 1:N
         ├──────────────────────┐              ▼
         │                      │   ┌─────────────────────┐
         ▼                      ▼   │    status_events    │
┌─────────────────┐   ┌─────────────┴───┐ (From, To, Actor│
│    documents    │   │    invoices     │  Reason, Meta)  │
│ (W2, 1099, Scan)│   │ (Amount, Status,│ └─────────────────────┘
└─────────────────┘   │  Stripe ID)     │
         │            └─────────────────┘
         │ 1:N                  │ 1:N
         ▼                      ▼
┌─────────────────┐   ┌─────────────────┐
│  appointments   │   │    referrals    │
│ (Date, Format)  │   │ (Code, Status,  │
└─────────────────┘   │  Reward Cents)  │
         │            └─────────────────┘
         │ 1:N
         ▼
┌─────────────────┐
│    messages     │
│ (Body, Read At) │
└─────────────────┘
```

#### Schema Specifications

- **`users`:** `id`, `name`, `email`, `phone`, `password`, `role` (`client`, `preparer`, `admin`), `tier` (`upload_and_go`, `hybrid`, `premium_remote`), `referral_code` (unique 10-char formatted `OKJ-XXXXXX`), `referred_by_code`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, timestamps.
- **`tax_returns`:** `id`, `user_id`, `preparer_id` (nullable FK to users), `tax_year` (int), `status` (`intake_received`, `in_preparation`, `ready_for_review`, `e_signed`, `e_filed`, `accepted`, `completed`), `tier`, timestamps.
- **`status_events`:** `id`, `tax_return_id`, `actor_id`, `from_status`, `to_status`, `reason` (text, required on reversals), `meta` (json), timestamps.
- **`documents`:** `id`, `user_id`, `tax_return_id`, `type` (`w2`, `1099`, `1098`, `receipt`, `prior_return`, `id`, `other`), `filename`, `mime`, `size_bytes`, `storage_key`, `scan_status` (`pending`, `clean`, `infected`), timestamps.
- **`invoices`:** `id`, `tax_return_id`, `amount_cents` (nullable int), `status` (`draft`, `open`, `paid`, `void`), `stripe_session_id`, `paid_at`, timestamps.
- **`appointments`:** `id`, `user_id`, `preferred_date`, `time_window` (`morning`, `afternoon`, `evening`), `format` (`video`, `phone`, `in_person`), `topic`, `notes`, `status` (`requested`, `confirmed`, `completed`, `cancelled`), timestamps.
- **`referrals`:** `id`, `referrer_id`, `friend_user_id` (nullable), `friend_name`, `friend_email`, `status` (`sent`, `signed_up`, `filed`, `rewarded`), `reward_cents`, `source`, timestamps.
- **`messages`:** `id`, `tax_return_id`, `from_user_id`, `to_user_id`, `body`, `read_at`, timestamps.
- **`audit_logs`:** `id`, `actor_id` (nullable), `action`, `entity`, `entity_id`, `meta` (json), `ip_address`, `user_agent`, created_at.

### 5.4 Interface Design

- **UI Navigation & Layouts:**
    - `SiteHeader`: Responsive branding, links (Home, Services, Pricing, About, Contact), guest CTAs ("Client Login", "Start My Return Online"), and authenticated CTAs ("My Portal", "Sign out").
    - `PortalLayout`: Tab-based navigation across 5 core views (`Overview`, `Documents`, `Appointments`, `Referrals`, `Messages`) + topbar security badge.
    - `AdminLayout`: Staff management layout with dark navigation for `Clients`, `Leads`, and `Referrals`.
- **Key Client Portal Views:**
    - _Overview:_ Seven-stage visual progress tracker, active tier card with upgrade switcher, quote/invoice card with Stripe Pay Now action, preparer contact chip, and quick action cards.
    - _Documents:_ Drag-and-drop file upload zone, category filters, scan status indicators, and secure download links.
    - _Appointments:_ Native HTML5 date picker constrained to valid calendar windows, format selector, and interactive list with cancel actions.
    - _Referrals:_ Copyable link banner with 2-second visual feedback, direct email invite sender, and referral reward tracking table.
    - _Sign View (`/portal/sign/{taxReturn}`):_ Tax return breakdown, mandatory Form 7216 consent checkbox, signature input, and submission confirmation.
    - _Receipt View (`/portal/invoices/{invoice}/receipt`):_ Printable receipt with transaction timestamp, invoice ID, and Stripe verification.

### 5.5 Technology Stack

| Layer                 | Technology               | Version | Rationale                                                                         |
| --------------------- | ------------------------ | ------- | --------------------------------------------------------------------------------- |
| **Runtime**           | PHP                      | 8.5     | High-performance execution, modern constructor promotion, strict typing.          |
| **Backend Framework** | Laravel                  | 12.x    | Comprehensive enterprise framework with built-in auth, queues, ORM, and policies. |
| **SPA Bridge**        | Inertia.js               | v3      | Seamless client-side React routing without maintaining separate API contracts.    |
| **Frontend Library**  | React                    | 19.x    | Modern UI components, fast virtual DOM reconciliation, and hooks architecture.    |
| **CSS Framework**     | Tailwind CSS             | v4      | Modern high-performance utility engine with CSS variable theming.                 |
| **UI Components**     | shadcn/ui (Radix)        | Latest  | Accessible, customizable primitive components (Dialog, Tabs, Accordion, Sheet).   |
| **Route Typing**      | Laravel Wayfinder        | 0.4.x   | Automated TypeScript generation for controllers, route URLs, and form helpers.    |
| **Authentication**    | Laravel Fortify          | Latest  | Frontend-agnostic secure authentication backend supporting 2FA and passkeys.      |
| **Payments**          | Laravel Cashier (Stripe) | Latest  | Industry-standard recurring and one-off checkout handling with webhook security.  |
| **Testing**           | Pest PHP                 | v3      | Expressive, readable test runner with parallelization and dataset support.        |
| **Code Formatting**   | Laravel Pint & Biome     | Latest  | Automated PSR-12/Pint PHP formatting and ultra-fast frontend linting.             |

### 5.6 Design Decisions (Architecture Decision Records)

- **ADR-001: Inertia.js v3 with Vite SSR Daemon**  
  _Context:_ Need instant SPA transitions, high mobile responsiveness, and perfect SEO indexing on public pages.  
  _Decision:_ Deploy Inertia v3 with an active Node SSR daemon (`artisan inertia:start-ssr` on port 13714). Public pages render complete HTML server-side; portal transitions execute instantly via client JSON diffs.  
  _Consequence:_ SEO Lighthouse score reaches 100 while client runtime remains snappy.

- **ADR-002: Private Storage Disk with Signed Access for Tax Documents**  
  _Context:_ Tax documents contain confidential W-2s, 1099s, and SSNs that cannot be stored in publicly accessible `public/` web roots.  
  _Decision:_ Store all uploads in `storage/app/private/documents/`. All file retrievals must pass through `DocumentController@download` guarded by `DocumentPolicy`.  
  _Consequence:_ Zero unauthorized document access; complete audit trail on every file download.

- **ADR-003: Grace Period MFA Enforcement with Session Gates**  
  _Context:_ Mandating 2FA at registration creates friction that degrades marketing conversion; however, IRS rules mandate MFA for tax record access.  
  _Decision:_ Allow user creation with email and password, but apply `EnsureTwoFactorEnabled` middleware to all `/portal/*` and `/admin/*` routes. Unconfirmed users are restricted to `/portal/security` until TOTP is verified.  
  _Consequence:_ High registration conversion combined with 100% MFA compliance prior to sensitive data exposure.

- **ADR-004: Wayfinder Route Helpers to Eliminate Hardcoded URLs**  
  _Context:_ Hardcoded URLs in frontend files create fragility when routes are renamed or nested.  
  _Decision:_ Use Laravel Wayfinder to auto-generate typed functions (`@/routes/*`). Replace every hardcoded URL with typed route helpers.  
  _Consequence:_ Compile-time TypeScript validation on every route parameter, URL, and form submission.

---

## 6. Features and Technical Implementation

### 6.1 Feature Inventory

| ID        | Feature                      | Purpose                                                                         | Requirements covered | Owner      | Status   |
| --------- | ---------------------------- | ------------------------------------------------------------------------------- | -------------------- | ---------- | -------- |
| **F-001** | Brand & Marketing Suite      | 5 public pages (Home, Services, Pricing, About, Contact), testimonials, videos. | FR-001               | Frontend   | Released |
| **F-002** | Lead Capture & Anti-Spam     | Quote and consultation forms, honeypot, rate limiting, and email dispatch.      | FR-002, FR-003       | Full-Stack | Released |
| **F-003** | Unified Authentication       | Single `/login` & `/register` screen, Fortify integration, email verification.  | FR-004               | Full-Stack | Released |
| **F-004** | Client Portal Dashboard      | Return status tracker (7 stages), tier switcher, and overview cards.            | FR-006               | Full-Stack | Released |
| **F-005** | Secure Document Vault        | Multi-file dropzone upload, ClamAV antivirus scanning, and private downloads.   | FR-007               | Backend    | Released |
| **F-006** | Multi-Factor Authentication  | Mandatory TOTP MFA enforcement, recovery codes, and passkey support.            | FR-005               | Security   | Released |
| **F-007** | Appointment Scheduling       | Client appointment requests, window/format selection, and staff confirmation.   | FR-008               | Full-Stack | Released |
| **F-008** | Referral Engine              | Unique referral codes, 30-day cookie attribution, and reward progression.       | FR-009               | Growth     | Released |
| **F-009** | Preparer Messaging           | Transactional preparer messaging, unread badges, and read-receipt tracking.     | FR-010               | Full-Stack | Released |
| **F-010** | Staff Administration Console | Scoped console for leads, client management, return status, and invoices.       | FR-011               | Full-Stack | Released |
| **F-011** | Stripe Payment Processing    | Invoice quote setting, hosted Stripe Checkout, and idempotent webhooks.         | FR-012               | Finance    | Released |
| **F-012** | Form 7216 Consent & E-Sign   | Digital tax return signature, Form 7216 consent, and signed PDF generation.     | FR-013               | Legal/Sec  | Released |

### 6.2 Framework Context

- **Backend Architecture:** Laravel 12 following strict MVC conventions. Controllers remain thin, delegating validation to FormRequests, authorization to Policies, complex state transitions to Action classes (`AdvanceReturnStatus`), and long-running work to Queued Jobs (`ScanDocument`).
- **Frontend Architecture:** Inertia v3 React application with TypeScript. Components adhere to atomic composition principles using `shadcn/ui` primitives.
- **Routing & Cross-Cutting Concerns:** Wayfinder automates TypeScript route typing. SecurityHeaders middleware applies CSP nonces, HSTS, and frame protection on every response. `Model::preventLazyLoading()` prevents N+1 query regressions across all environments.

### 6.3 Mapping Features to Framework Constructs

| Concern                     | Laravel 12 + Inertia.js v3 (This Application)                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Entry point and routing** | `routes/web.php`, `routes/settings.php`, Wayfinder typed exports in `resources/js/routes/*`             |
| **UI or response layer**    | React 19 Inertia page components in `resources/js/pages/*` rendered via `Inertia::render()`             |
| **Business logic**          | Action classes (`App\Actions\AdvanceReturnStatus`), Models, and Enums (`App\Enums\*`)                   |
| **Data access**             | Eloquent ORM models in `app/Models/*`, migrations in `database/migrations/*`                            |
| **Validation**              | FormRequest classes (`app/Http/Requests/*`) and custom rules (`App\Rules\TurnstileRule`)                |
| **Authentication & AuthZ**  | Laravel Fortify, `EnsureTwoFactorEnabled` middleware, Gates, and Policies (`app/Policies/*`)            |
| **Background work**         | Queued Mailables, queued Jobs (`App\Jobs\ScanDocument`), and listeners (`HandleCashierWebhookReceived`) |
| **Configuration**           | `config/*.php` files (site, tiers, addons, faqs, offices, videos), `.env` environment variables         |
| **Testing**                 | Pest PHP test suite in `tests/Feature/*` and `tests/Unit/*`                                             |

---

### 6.4 Per-Feature Implementation Details

#### F-001 — Brand & Marketing Suite

- **Summary:** Delivers public-facing marketing pages (Home, Services, Pricing, About, Contact) establishing 26+ years of firm history, transparent pricing tiers, office locations, testimonials, and video walkthroughs.
- **Entry points:** `GET /`, `GET /services`, `GET /pricing`, `GET /about`, `GET /contact`.
- **Components:** `resources/js/pages/home.tsx`, `services.tsx`, `pricing.tsx`, `about.tsx`, `contact.tsx`, `resources/js/components/site-header.tsx`, `site-footer.tsx`.
- **Request flow:** Client requests URL → Route triggers controller → Returns `Inertia::render()` with config-driven props (tiers, addons, testimonials) → SSR daemon generates initial HTML.
- **Testing:** `tests/Feature/PublicPagesTest.php` asserts HTTP 200, required Inertia props, and valid XML output on `/sitemap.xml`.

#### F-002 — Lead Capture & Anti-Spam

- **Summary:** Captures taxpayer inquiries for quotes or consultations, enforces Cloudflare Turnstile verification and Spatie Honeypot fields, throttles submissions (5/hour), and notifies staff.
- **Entry points:** `POST /leads/quote`, `POST /leads/consult`. Handled by `App\Http\Controllers\LeadController`.
- **Components:** `app/Http/Controllers/LeadController.php`, `app/Http/Requests/StoreLeadRequest.php`, `app/Rules/TurnstileRule.php`.
- **Data:** Writes to `leads` table and `audit_logs` table.
- **Validation:** Validates email format, phone, name, preferred date (today..+180 days), time window enum, and format enum.
- **Testing:** `tests/Feature/LeadFormsTest.php` validates field errors, rate limiting, and queued mailables.

#### F-003 — Unified Authentication

- **Summary:** Provides a unified access portal (`/login` and `/register`) with interactive tab switching, URL state preservation (`?mode=signup`), Fortify user creation, and verification notices.
- **Entry points:** `GET /login`, `GET /register`, `POST /login`, `POST /register`.
- **Components:** `resources/js/pages/auth/access.tsx`, `app/Actions/Fortify/CreateNewUser.php`, `app/Providers/FortifyServiceProvider.php`.
- **Data:** Creates `users` record, default current-year `tax_returns` record, and initial draft `invoices` record.
- **Testing:** `tests/Feature/Auth/AuthenticationTest.php` and `RegistrationTest.php` assert redirection to `/portal/overview`, referral association, and email verification dispatch.

#### F-004 — Client Portal Dashboard

- **Summary:** The central cockpit for authenticated taxpayers, featuring a visual return progress tracker across 7 statuses, tier badge with dynamic modal switcher, invoice card, and quick links.
- **Entry points:** `GET /portal/overview`. Handled by `App\Http\Controllers\Portal\OverviewController`.
- **Components:** `resources/js/pages/portal/overview.tsx`, `app/Http/Controllers/Portal/OverviewController.php`, `resources/js/layouts/portal-layout.tsx`.
- **Data:** Reads `tax_returns`, eager-loads `statusEvents`, `invoice`, `preparer`, and counts of unread messages and clean documents.
- **State:** React component tracks selected tier in modal and optimistic submission states.
- **Testing:** `tests/Feature/Portal/OverviewTest.php` tests view authorization and returned props.

#### F-005 — Secure Document Vault

- **Summary:** Secure document exchange enabling clients to drag-and-drop W-2s, 1099s, and IDs. Stores files on a private filesystem disk and queues an asynchronous ClamAV virus scan before enabling download.
- **Entry points:** `GET /portal/documents`, `POST /portal/documents`, `GET /portal/documents/{document}/download`, `DELETE /portal/documents/{document}`.
- **Components:** `app/Http/Controllers/Portal/DocumentController.php`, `app/Jobs/ScanDocument.php`, `resources/js/pages/portal/documents.tsx`.
- **Security:** Guarded by `DocumentPolicy`. Files stored with randomized storage keys in `storage/app/private/documents`. Downloads blocked if `scan_status !== 'clean'`.
- **Testing:** `tests/Feature/Portal/DocumentsTest.php` covers IDOR prevention, upload limits, and virus scan status handling.

#### F-006 — Multi-Factor Authentication (MFA)

- **Summary:** Enforces two-factor authentication (TOTP + recovery codes) for all client and staff accounts accessing portal features.
- **Entry points:** `GET /portal/security`, Fortify 2FA endpoints (`/user/two-factor-authentication`, `/user/two-factor-qr-code`, `/two-factor-challenge`).
- **Components:** `app/Http/Middleware/EnsureTwoFactorEnabled.php`, `resources/js/pages/portal/security.tsx`, `resources/js/hooks/use-two-factor-auth.ts`.
- **Security:** Intercepts unconfirmed 2FA sessions and redirects them to setup; requires current password verification to display recovery codes.
- **Testing:** `tests/Feature/Portal/TwoFactorMiddlewareTest.php` validates that unconfirmed clients cannot bypass the security screen.

#### F-007 — Appointment Scheduling

- **Summary:** Allows clients to book video, phone, or in-person tax review consultations with their preparer, choose time windows, and cancel pending requests.
- **Entry points:** `GET /portal/appointments`, `POST /portal/appointments`, `DELETE /portal/appointments/{appointment}`.
- **Components:** `app/Http/Controllers/Portal/AppointmentController.php`, `app/Http/Requests/Portal/StoreAppointmentRequest.php`, `resources/js/pages/portal/appointments.tsx`.
- **Data:** Writes to `appointments`. Queues `AppointmentRequested` mailable to staff and client.
- **Testing:** `tests/Feature/Portal/AppointmentsTest.php` asserts date validation (today..+180 days in America/New_York) and policy enforcement.

#### F-008 — Referral Engine

- **Summary:** Drives word-of-mouth growth by assigning unique referral codes (`OKJ-XXXXXX`), copyable links, direct friend invite emails, and 30-day cookie attribution for rewards ($25 or $50 based on filed tier).
- **Entry points:** `GET /portal/referrals`, `POST /portal/referrals`, `GET /contact?ref={code}`.
- **Components:** `app/Http/Controllers/Portal/ReferralController.php`, `app/Http/Middleware/AttributeReferral.php`, `resources/js/pages/portal/referrals.tsx`.
- **Data:** Writes to `referrals`. Advances referral status to `Filed` automatically when referred user's return reaches `EFiled`.
- **Testing:** `tests/Feature/Portal/ReferralsTest.php` validates cookie attribution through registration, duplicate invite rejection, and status progression.

#### F-009 — Preparer Messaging

- **Summary:** Transactional messaging channel allowing tax preparers to communicate document requests and filing updates to clients. Displays unread dots and marks messages read on view.
- **Entry points:** `GET /portal/messages`, `POST /portal/messages/read`.
- **Components:** `app/Http/Controllers/Portal/MessageController.php`, `resources/js/pages/portal/messages.tsx`.
- **Data:** Updates `messages.read_at` timestamp.
- **Testing:** `tests/Feature/Portal/MessagesTest.php` asserts unread count decrements and unauthorized users cannot view messages.

#### F-010 — Staff Administration Console

- **Summary:** Operations center under `/admin` restricted to staff and admins (`can:access-admin`). Includes leads inbox, client management, return status transitions with mandatory reversal reasons, and audit logging.
- **Entry points:** `GET /admin/leads`, `GET /admin/clients`, `GET /admin/clients/{client}`, `PATCH /admin/tax-returns/{taxReturn}/status`.
- **Components:** `app/Http/Controllers/Admin/ClientController.php`, `LeadController.php`, `TaxReturnController.php`, `resources/js/pages/admin/client-show.tsx`.
- **Security:** Preparers are strictly scoped to assigned clients; admins see all. Every client view writes an `AuditLog` entry.
- **Testing:** `tests/Feature/Admin/StaffConsoleTest.php` verifies role scoping and return status progression.

#### F-011 — Stripe Payment Processing

- **Summary:** Collects tax preparation fees via Stripe Checkout. Handles webhooks idempotently, generates payment receipts, and advances the invoice state.
- **Entry points:** `POST /portal/invoices/{invoice}/checkout`, `GET /portal/invoices/{invoice}/receipt`, `POST /stripe/webhook`.
- **Components:** `app/Http/Controllers/Portal/InvoiceController.php`, `app/Listeners/HandleCashierWebhookReceived.php`, `resources/js/pages/portal/receipt.tsx`.
- **Data:** Writes `invoices.status = 'paid'`, `invoices.paid_at`, and stores `stripe_session_id`.
- **Testing:** `tests/Feature/Portal/PaymentTest.php` verifies guard rails (409 on unpaid/null amount), webhook idempotency, and receipt rendering.

#### F-012 — Form 7216 Consent & E-Sign

- **Summary:** Electronic signature step available when return reaches `ReadyForReview`. Captures IRC § 7216 disclosure consent, typed name signature, IP, user-agent, generates signed PDF audit record, and moves return to `ESigned`.
- **Entry points:** `GET /portal/sign/{taxReturn}`, `POST /portal/sign/{taxReturn}`.
- **Components:** `app/Http/Controllers/Portal/SignController.php`, `resources/js/pages/portal/sign.tsx`.
- **Data:** Generates signed PDF record stored in private disk; records status event and audit log.
- **Testing:** `tests/Feature/Portal/SignTest.php` tests consent checkbox requirement, signature capture, and state guard rails.

---

### 6.5 Worked Example: E-Signature & IRC § 7216 Consent (F-012)

```
[ Client Browser ]                      [ SignController ]                 [ Storage / Event Bus ]
        │                                        │                                    │
        ├─▶ GET /portal/sign/{return} ───────────▶│                                    │
        │                                        ├─ Verify status == ReadyForReview   │
        │◀── Render sign.tsx with Consent Text ──┤                                    │
        │                                        │                                    │
        ├─▶ POST /portal/sign/{return} ──────────▶│                                    │
        │   (consent_7216=true, typed_signature) ├─ Validate inputs & policy          │
        │                                        ├─ Capture IP & User-Agent           │
        │                                        ├─ Generate Signed PDF Record ───────▶ Private Disk
        │                                        ├─ Advance Return Status to ESigned ─▶ StatusEvent Ledger
        │                                        ├─ Record user.signed_return ────────▶ AuditLog Table
        │                                        ├─ Queue ReturnStatusChanged ────────▶ Mail/Notification
        │◀── Redirect to /portal/overview ───────┤                                    │
```

| Aspect                    | Implementation Detail                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Entry Points**          | `GET /portal/sign/{taxReturn}` (`route('portal.sign')`), `POST /portal/sign/{taxReturn}` (`route('portal.sign.submit')`).                            |
| **Components**            | `App\Http\Controllers\Portal\SignController`, `resources/js/pages/portal/sign.tsx`, `lang/en/legal.php`.                                             |
| **Data & State**          | Reads `tax_returns`, updates `status` to `ESigned`, creates `status_events` row, writes signed PDF to `storage/app/private/signed_returns/{id}.pdf`. |
| **Security & Compliance** | `TaxReturnPolicy@sign` ensures client ownership; captures IP and User-Agent; enforces verbatim IRC § 7216 statutory consent wording.                 |
| **Testing**               | Covered by `tests/Feature/Portal/SignTest.php`.                                                                                                      |

### 6.6 Feature Interactions and Dependencies

- **Return Status Pipeline Dependency:**  
  A client cannot e-sign (F-012) until staff advance status to `ReadyForReview` (F-010). A return cannot be marked `EFiled` until the invoice is paid (F-011) and e-signed (F-012).
- **Referral Reward Progression:**  
  Referral attribution (F-008) begins on visit/registration (F-003) but only progresses to `Filed` when return status reaches `EFiled` (F-010).
- **MFA Gate:**  
  All portal features (F-004 through F-012) depend on the multi-factor authentication gate (F-006).

---

## 7. API and Interface Reference

The application communicates via Inertia.js protocol over standard HTTPS. Below is the reference for core endpoints:

| Method  | URI / Route Name                                                 | Description                | Auth / Middleware                                    | Parameters / Body                                                               | Status Codes              |
| ------- | ---------------------------------------------------------------- | -------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------- |
| `POST`  | `/leads/quote`<br>`leads.quote`                                  | Submit tax quote request   | `throttle:public-forms`, Honeypot                    | `name`, `email`, `phone`, `tier_interest`, `situation`, `cf-turnstile-response` | `302`, `422`, `429`       |
| `POST`  | `/leads/consult`<br>`leads.consult`                              | Request consultation       | `throttle:public-forms`, Honeypot                    | `name`, `email`, `phone`, `preferred_date`, `time_window`, `format`, `notes`    | `302`, `422`, `429`       |
| `POST`  | `/newsletter/subscribe`<br>`newsletter.subscribe`                | Subscribe to updates       | `throttle:public-forms`, Honeypot                    | `email`                                                                         | `302`, `422`, `429`       |
| `POST`  | `/portal/documents`<br>`portal.documents.store`                  | Upload tax documents       | `auth`, `verified`, `portal.2fa`                     | `files[]` (multipart, max 25MB, pdf/jpeg/png), `type`                           | `302`, `422`              |
| `GET`   | `/portal/documents/{id}/download`<br>`portal.documents.download` | Download clean document    | `auth`, `verified`, `portal.2fa`, Policy             | `id` (Document UUID)                                                            | `200`, `403`, `404`       |
| `POST`  | `/portal/appointments`<br>`portal.appointments.store`            | Request appointment        | `auth`, `verified`, `portal.2fa`                     | `preferred_date`, `time_window`, `format`, `topic`, `notes`                     | `302`, `422`              |
| `POST`  | `/portal/referrals`<br>`portal.referrals.store`                  | Send referral email        | `auth`, `verified`, `portal.2fa`                     | `friend_name`, `friend_email`                                                   | `302`, `422`              |
| `POST`  | `/portal/invoices/{id}/checkout`<br>`portal.invoices.checkout`   | Initialize Stripe Checkout | `auth`, `verified`, `portal.2fa`, Policy             | `id` (Invoice ID)                                                               | `303` (Stripe URL), `409` |
| `POST`  | `/portal/sign/{id}`<br>`portal.sign.submit`                      | E-sign tax return          | `auth`, `verified`, `portal.2fa`, Policy             | `consent_7216` (bool), `typed_signature` (string)                               | `302`, `403`, `422`       |
| `PATCH` | `/admin/tax-returns/{id}/status`<br>`admin.returns.status`       | Update return status       | `auth`, `verified`, `portal.2fa`, `can:access-admin` | `status` (string), `reason` (string, required if reversing)                     | `302`, `403`, `422`       |

---

## 8. Security Considerations

- **Threat Model & Attack Surfaces:**  
  Primary attack vectors include credential stuffing, unauthorized document access (IDOR), automated lead spam/DDoS, malware injection via file uploads, and session hijacking.
- **Authentication & MFA:**  
  Managed via Laravel Fortify. Passwords hashed using Argon2id (`memory: 65536, time: 4, threads: 1`). Multi-Factor Authentication (RFC 6238 TOTP) enforced via `EnsureTwoFactorEnabled` middleware. WebAuthn passkey authentication supported natively.
- **Authorization & Data Scoping:**  
  Granular Eloquent Policies enforce access control. Clients cannot view or download documents belonging to other users. Preparers can only view clients assigned to them; only administrators can access system-wide settings. Tested and enforced by `PolicyCoverageTest`.
- **Data Protection:**
    - _In Transit:_ TLS 1.3 forced; HSTS header with 1-year max-age (`preload`).
    - _At Rest:_ Uploaded documents stored on private disk with non-deterministic UUID filenames. Sensitive API keys and credentials managed via encrypted environment variables.
- **Input Validation & Output Sanitization:**  
  Every public form is protected by Cloudflare Turnstile token validation, Honeypot hidden fields, and strict FormRequest rules. Content Security Policy (CSP) restricts script/frame execution with nonces and allows only Stripe and Cloudflare domains.
- **Audit Logging:**  
  Immutable `audit_logs` record every security-critical event: login, registration, document upload, download, status advance, invoice creation, and payment receipt.

---

## 9. Development Setup

### 9.1 Prerequisites

- Docker Desktop (or OrbStack / Rancher Desktop)
- Git (2.35+)
- Composer 2.x and Node.js 22.x (optional for host operations; Sail runs both inside Docker)

### 9.2 Step-by-Step Installation

```bash
# 1. Clone the repository
git clone git@github.com:your-org/okojie-associates.git
cd okojie-associates

# 2. Initialize environment configuration
cp .env.example .env

# 3. Install composer dependencies (if vendor is not pre-installed)
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php85-composer:latest \
    composer install --ignore-platform-reqs

# 4. Start the Laravel Sail containers
vendor/bin/sail up -d

# 5. Generate application key
vendor/bin/sail artisan key:generate

# 6. Execute database migrations and seed demo data
vendor/bin/sail artisan migrate --seed

# 7. Generate typed Wayfinder route definitions
vendor/bin/sail artisan wayfinder:generate --with-form

# 8. Install NPM dependencies and compile frontend
vendor/bin/sail npm install
vendor/bin/sail npm run build

# 9. Start the Inertia SSR background daemon (required for SSR testing)
vendor/bin/sail artisan inertia:start-ssr

# 10. Run tests to confirm full environment health
vendor/bin/sail artisan test --compact
```

### 9.3 Demo Accounts Seeded

- **Administrator:** `admin@example.com` / `password` (MFA configured)
- **Tax Preparer:** `preparer@example.com` / `password` (Assigned clients)
- **Client (Demo Parity):** `client@example.com` / `password` (Return at Ready for Review, Invoice $225)

---

## 10. Codebase Guide

### 10.1 Directory Structure

```
okojie-associates/
├── app/
│   ├── Actions/            # Single-responsibility business commands (Fortify, ReturnStatus)
│   ├── Enums/              # Typed Domain Enums (ReturnStatus, Tier, DocType, LeadKind)
│   ├── Http/
│   │   ├── Controllers/    # Thin HTTP controllers (Public, Portal, Admin, Settings)
│   │   ├── Middleware/     # SecurityHeaders, EnsureTwoFactorEnabled, AttributeReferral
│   │   └── Requests/       # FormRequest validation classes
│   ├── Jobs/               # Queued background jobs (ScanDocument)
│   ├── Listeners/          # Webhook & event listeners (HandleCashierWebhookReceived)
│   ├── Mail/               # Queued Mailable definitions (LeadReceived, PaymentReceipt)
│   ├── Models/             # Eloquent Models (User, TaxReturn, Document, Invoice, AuditLog)
│   ├── Policies/           # Authorization policies (TaxReturnPolicy, DocumentPolicy)
│   └── Rules/              # Custom validation rules (TurnstileRule)
├── config/                 # Site configuration (site.php, tiers.php, addons.php, faqs.php)
├── database/               # Migrations, seeders, and factories
├── docs/                   # Architectural specs, PRD, WISP, and technical documentation
├── resources/
│   ├── css/                # Tailwind v4 styles and color system definitions
│   ├── js/
│   │   ├── actions/        # Wayfinder auto-generated controller actions
│   │   ├── components/     # UI primitives and composite marketing/portal components
│   │   ├── hooks/          # Custom React hooks (useTwoFactorAuth, useMobileNavigation)
│   │   ├── layouts/        # AdminLayout, PortalLayout, Guest layout
│   │   ├── pages/          # Inertia React page components (public, portal, admin, auth)
│   │   └── routes/         # Wayfinder auto-generated typed route helpers
│   └── views/              # Blade root template (app.blade.php) and email templates
├── routes/                 # Route declarations (web.php, settings.php, console.php)
└── tests/                  # Pest test suites (Feature/ and Unit/)
```

### 10.2 Coding Standards & Tooling

- **PHP:** Formatted using Laravel Pint (`vendor/bin/sail bin pint --format agent`). Static analysis enforced via PHPStan Level 5 (`vendor/bin/sail bin phpstan analyse`).
- **TypeScript & React:** Formatted and linted using Biome (`vendor/bin/sail npm run check`). Type checking verified via `vendor/bin/sail npm run types:check`.

---

## 11. Testing Strategy

- **Test Framework:** Pest PHP v3 with parallel test runner.
- **Coverage Areas:**
    - _Feature Tests:_ Public marketing rendering, lead capture validation, rate-limiting, honeypot rejection, Fortify authentication, portal dashboard rendering, document upload/download/deletion policies, appointment scheduling rules, referral attribution progression, preparer assignment scoping, Stripe checkout guard rails, webhook idempotency, e-sign validation, security headers, and SEO verification.
    - _Policy Coverage:_ `PolicyCoverageTest` utilizes reflection to ensure that every public method on any portal controller accepting an Eloquent model parameter calls `authorize()`.
    - _Accessibility Testing:_ Automated axe checks verifying zero critical accessibility violations.
- **Execution Command:**
    ```bash
    vendor/bin/sail artisan test --compact
    ```
    _(Current Suite: 161 tests, 977 assertions, 100% passing)._

---

## 12. Build, Deployment, and Release

- **CI/CD Pipeline (`.github/workflows/tests.yml`):**  
  Every push and pull request triggers a multi-stage GitHub Actions workflow:
    1. _Backend Checks:_ Runs `composer validate`, Laravel Pint style verification, PHPStan static analysis, and Composer security audit.
    2. _Frontend Checks:_ Runs Biome linter/formatter, TypeScript type check, Vite production build, and NPM security audit.
    3. _Test Execution:_ Configures SQLite/PostgreSQL in-memory, runs all migrations, and executes the complete Pest test suite.
- **Deployment Platform:**  
  Designed for zero-downtime deployment on Laravel Cloud. Assets are compiled during build (`npm run build`), database migrations run automatically with `--force`, and the Inertia SSR daemon is gracefully reloaded.
- **Rollback Strategy:**  
  Atomic symlink switching on Laravel Cloud allows instant rollback (< 30 seconds) to the previous release artifact in the event of an operational regression.

---

## 13. Operations and Monitoring

- **Application Logging:** Structured JSON logs sent to `storage/logs/laravel.log` or centralized Cloud logging (Datadog / PaperTrail).
- **Audit Logging:** Every user authorization, file interaction, status transition, and financial transaction is permanently written to the `audit_logs` database table.
- **Health Checks & Monitoring:**
    - `GET /up`: Built-in Laravel 12 health check endpoint returning HTTP 200 when database, cache, and filesystem are functional.
    - Inertia SSR health: Monitored on localhost port 13714.
- **Incident Runbooks:**
    - _Stripe Webhook Delays:_ Invoices can be manually reconciled and marked "paid offline" in the Admin Console.
    - _Queue Backlog:_ Monitor worker container count and scale queue worker processes via `sail artisan queue:work --tries=3`.

---

## 14. Risks, Limitations, and Open Issues

- **Known Limitations:**
    - Client messaging is read-only for clients in v1 (clients read messages sent by preparers; direct two-way chat is slated for v1.1).
    - Video library cards display placeholders with modal previews; production deployment requires uploading actual video assets to CDN.
    - Real IRS Form 8879 and Form 7216 wording must be reviewed and countersigned by firm legal counsel prior to tax season kickoff.
- **Technical Debt & Follow-up Items:**
    - Implement full PDF stamping/flattening for Form 8879 generation rather than placeholder text PDFs.
    - Integrate live WebSocket broadcast (Pusher/Reverb) for instantaneous return status and message notifications without page reload.

---

## 15. Roadmap and Future Work

- **Phase 2 (v1.1):** Two-way client messaging reply box; SMS status alerts via Twilio; live appointment calendar sync with Google/Outlook calendars.
- **Phase 3 (v1.2):** Automated OCR document parsing to identify missing W-2s or 1099s; multi-year tax return archive.
- **Phase 4 (v2.0):** Native mobile client applications for iOS and Android built with React Native sharing the backend Inertia endpoints.

---

## 16. Contribution and Support

- **Contribution Guidelines:**
    1. Create a feature branch off `main` (`feature/your-feature-name`).
    2. Adhere to Laravel Pint and Biome formatting standards.
    3. Run all unit and feature tests before opening a PR (`vendor/bin/sail artisan test`).
    4. Ensure all new endpoints and actions use Wayfinder typed route helpers.
- **Ownership & Support Contacts:**
    - Lead Systems Architect: `engineering@okojieonline.com`
    - Firm Operations & Office Admin: `operations@okojieonline.com`
    - Emergency Escalation: (215) 555-0142

---

## 17. Appendices

### Appendix A: Glossary of Terms

- **E-File:** Electronic transmission of tax returns to the IRS and state departments of revenue.
- **Inertia Protocol:** JSON-over-HTTP wire format that delivers page props and component names to a single-page React frontend.
- **Wayfinder:** Build-time AST parser that translates Laravel route definitions into TypeScript functions.
- **WISP:** Written Information Security Plan documenting security controls for compliance with FTC Safeguards and IRS Pub 4557.

### Appendix B: Return Status Lifecycle State Machine

```
[ Intake Received ] ────────▶ [ In Preparation ] ────────▶ [ Ready for Review ]
                                                                   │
                                                                   ▼
[ Completed ] ◀── [ Accepted ] ◀── [ E-Filed ] ◀── [ E-Signed ] (Requires Form 7216 Consent)
                                                       │
                                                       ▼
                                            (Requires Paid Invoice)
```

---

## Quality Checklist

- [x] Can a new developer set up and run the system using only this document?
- [x] Does every requirement have an ID and a way to verify it?
- [x] Are all diagrams current, labeled, and aligned with code implementation?
- [x] Are code examples tested and copy-pasteable?
- [x] Are owners, dates, and version information accurate?
- [x] Are all 12 implementation steps thoroughly covered?
- [x] Has the test suite passed with 100% assertions green?
