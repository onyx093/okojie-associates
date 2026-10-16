# SPEC — Technical Specification

Tags: **[OBSERVED] [INFERRED] [CLAIMED] [DRAFTED]**.
**Mandated stack:** Laravel 13 · Inertia v3 · React 19 · Tailwind CSS v4 · shadcn/ui.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Backend framework | **Laravel 13** (PHP **8.3+**; 8.4/8.5 recommended) | Controllers, Form Requests, Policies, Eloquent, queues, scheduler, mail, filesystem |
| Bridge | **Inertia v3** (`inertiajs/inertia-laravel` ^3, `@inertiajs/react` ^3) | No separate API for the site's own UI; controllers return `Inertia::render()` or redirects. **SSR enabled** for public pages |
| Frontend | **React 19 + TypeScript** | Function components, hooks |
| Styling | **Tailwind CSS v4** (CSS-first config via `@theme` in `resources/css/app.css`, `@tailwindcss/vite`) | **No `tailwind.config.js`** |
| Components | **shadcn/ui** (installed into `resources/js/components/ui` via the shadcn CLI, `components.json`) + **lucide-react** | Radix-based, owned source code |
| Build | **Vite** + `laravel-vite-plugin` | |
| Typed routes | **Laravel Wayfinder** | Generates TS route/action helpers from Laravel routes/controllers |
| Auth | **Laravel Fortify** (login, register, password reset, email verification, **two-factor auth with TOTP + recovery codes**) | Views rendered through Inertia |
| DB | **PostgreSQL** (prod), **SQLite** (local/test) | Eloquent + migrations |
| Files | Laravel **Filesystem** — private **S3-compatible** disk (`league/flysystem-aws-s3-v3`), local disk in dev | `temporaryUrl()` for downloads |
| Mail | Laravel **Mailables/Notifications** (queued, Markdown mail); Resend/Postmark/SES transport; `log` driver in dev | |
| Payments | **Laravel Cashier (Stripe)** — Checkout one-off charge | |
| Queues/Jobs | `database` or `redis` driver; Horizon optional | Mail, virus scan |
| Rate limiting | Laravel `RateLimiter` + `throttle` middleware | |
| Spam protection | `spatie/laravel-honeypot` + Cloudflare Turnstile (custom validation rule) | |
| Testing | **Pest 4** (+ Laravel plugin, **browser plugin** for E2E), Larastan, Pint | Frontend: `tsc --noEmit`, ESLint, Prettier (Vitest optional) |

**Scaffolding recommendation:** start from the official Laravel **React starter kit** (installer → React → Laravel auth). It already wires Inertia, React 19, TypeScript, Tailwind v4, shadcn/ui, Fortify and Wayfinder. Then delete/replace its default dashboard and settings pages with the pages in this spec.

**Version caution:** Inertia v3 and Laravel 13 are newer than many references. Where an API differs from Inertia v2/Laravel 12 examples, **follow the official docs (or Laravel Boost guidelines) for the installed versions** and record the decision in `docs/DECISIONS.md`. Do not downgrade the mandated versions.

---

## 2. Routes (Laravel `routes/web.php` → Inertia pages)

Page components live in `resources/js/pages/*` (lowercase/kebab paths, matching the starter kit convention).

### Public
| Method | URI | Route name | Controller@action | Inertia page | Notes |
|---|---|---|---|---|---|
| GET | `/` | `home` | `HomeController` | `home` | props: tiers, steps, testimonials, videos, offices, faqs, stats |
| GET | `/services` | `services` | `ServicesController` | `services` | tiers, addons (table), faqs |
| GET | `/pricing` | `pricing` | `PricingController` | `pricing` | tiers, addons (cards), faqs |
| GET | `/about` | `about` | `AboutController` | `about` | |
| GET | `/contact` | `contact` | `ContactController` | `contact` | accepts `?ref=` `?tier=`; anchors `#start`, `#consult` |
| POST | `/leads/quote` | `leads.quote` | `LeadController@quote` | redirect back + flash | `throttle:public-forms`, honeypot, Turnstile |
| POST | `/leads/consult` | `leads.consult` | `LeadController@consult` | redirect back + flash | same |
| POST | `/newsletter` | `newsletter.subscribe` | `NewsletterController@store` | redirect back + flash | idempotent |
| GET | `/privacy` `/terms` `/security` | `legal.*` | `LegalController` | `legal/show` | **[INFERRED]** placeholders |
| GET | `/sitemap.xml` | `sitemap` | `SitemapController` | XML | |

### Auth (Fortify, views via Inertia)
| Method | URI | Notes |
|---|---|---|
| GET | `/login` | renders `auth/access` with `mode: 'signin'` |
| GET | `/register` | renders **the same** `auth/access` page with `mode: 'signup'`. `/login?mode=signup` → 301 to `/register`. Carries `?tier=` and `?next=` |
| POST | `/login`, `/register`, `/logout` | Fortify actions (custom `CreateNewUser` action, see §6) |
| GET/POST | `/forgot-password`, `/reset-password/{token}` | pages `auth/forgot-password`, `auth/reset-password` |
| GET | `/email/verify`, `/email/verify/{id}/{hash}` | page `auth/verify-email` |
| GET | `/two-factor-challenge` | page `auth/two-factor-challenge` (uses shadcn `input-otp`) |
| POST | `/user/two-factor-authentication` (+ confirm, recovery codes) | Fortify; managed from `/portal/security` |

### Client portal (middleware: `auth`, `verified`, `portal.2fa`)
| Method | URI | Route name | Controller@action | Page |
|---|---|---|---|---|
| GET | `/portal` | `portal` | redirect → `portal.overview` | |
| GET | `/portal/overview` | `portal.overview` | `Portal\OverviewController` | `portal/overview` |
| GET | `/portal/documents` | `portal.documents` | `Portal\DocumentController@index` | `portal/documents` |
| POST | `/portal/documents` | `portal.documents.store` | `@store` | redirect back (multipart) |
| GET | `/portal/documents/{document}/download` | `portal.documents.download` | `@download` | 302 to signed URL (plain `<a>`, not an Inertia link) |
| DELETE | `/portal/documents/{document}` | `portal.documents.destroy` | `@destroy` | redirect back |
| GET | `/portal/appointments` | `portal.appointments` | `Portal\AppointmentController@index` | `portal/appointments` |
| POST | `/portal/appointments` | `portal.appointments.store` | `@store` | redirect back |
| DELETE | `/portal/appointments/{appointment}` | `portal.appointments.destroy` | `@destroy` (cancel) | redirect back |
| GET | `/portal/referrals` | `portal.referrals` | `Portal\ReferralController@index` | `portal/referrals` |
| POST | `/portal/referrals` | `portal.referrals.store` | `@store` | redirect back |
| GET | `/portal/messages` | `portal.messages` | `Portal\MessageController@index` | `portal/messages` |
| POST | `/portal/messages/{message}/read` | `portal.messages.read` | `@read` | 204 |
| PATCH | `/portal/tier` | `portal.tier.update` | `Portal\TierController@update` | redirect → overview (used by "Choose X" when authed) |
| POST | `/portal/invoice/checkout` | `portal.invoice.checkout` | `Portal\InvoiceController@checkout` | `Inertia::location($stripeUrl)` |
| GET | `/portal/sign/{taxReturn}` | `portal.sign` | `Portal\SignController@show` | `portal/sign` **[INFERRED]** |
| POST | `/portal/sign/{taxReturn}` | `portal.sign.store` | `@store` | redirect → overview |
| GET | `/portal/security` | `portal.security` | `Portal\SecurityController` | `portal/security` (2FA setup, password change) **[INFERRED]** |

### Staff console `/admin/*` **[INFERRED]** (middleware: `auth`, `verified`, `portal.2fa`, `can:access-admin`)
`admin.leads.*`, `admin.clients.index|show`, `admin.returns.status` (PATCH), `admin.messages.store`, `admin.appointments.update`, `admin.invoices.update`, `admin.referrals.update`, `admin.documents.download`. Pages under `resources/js/pages/admin/*`.

### Webhooks
`POST /stripe/webhook` (Cashier) — exclude from CSRF; handle via `WebhookReceived` listener.

**Navigation rules**
- Header "Start My Return Online" → `contact` with `#start`.
- Hero "Book a Free Consultation" → `contact` with `#consult`.
- Referral banner: authed → `portal.referrals`; guest → `register?next=/portal/referrals`.
- Guests hitting `/portal/*` → `/login` with intended URL stored (Laravel `redirect()->guest`).
- Authed users hitting `/login` or `/register` → `portal.overview`.

---

## 3. Brand & content configuration (single place to rebrand)

Config files (PHP arrays, cacheable) — controllers pass what each page needs as Inertia props; `HandleInertiaRequests` shares `site` globally.

```
config/site.php         brand, tagline, footer blurb, contact, stats, compliance line, referral, seo, offices
config/tiers.php        3 tiers (slug, name, tagline, price_min, price_max, description, features[], best_for)
config/addons.php       5 add-ons
config/faqs.php         8 FAQs
config/testimonials.php testimonials
config/videos.php       Watch & Learn groups
config/steps.php        How-it-works steps
```

```php
// config/site.php
return [
  'brand' => ['legal_name' => 'Okojie & Associates, Inc.', 'product' => 'Okojie Online', 'mark' => 'O'],
  'tagline' => 'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore.',
  'footer_blurb' => 'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Serving individuals, families, and small businesses for 26+ years.',
  'contact' => ['phone' => '(215) 555-0142', 'email' => 'hello@okojieonline.com', 'hours' => 'Mon–Fri 9am–6pm'],
  'stats' => ['years' => '26+', 'returns' => '40,000+', 'preparers' => '12', 'offices' => '4'],
  'referral' => ['code_prefix' => 'OKJ', 'reward_range' => '$25–$50', 'reward_cents' => ['upload_and_go' => 2500, 'hybrid' => 5000, 'premium_remote' => 5000]],
  'compliance' => 'IRS Publication 4557 & FTC Safeguards compliant · Written Information Security Plan (WISP)',
  'seo' => ['title' => 'Okojie & Associates, Inc. — Okojie Online Tax Preparation'],
  'offices' => [ /* 4 offices from CONTENT.md §9 */ ],
];
```

All values: `CONTENT.md`.

---

## 4. Data model (Eloquent + migrations)

### 4.1 PHP backed enums (`app/Enums`)
```
Role:           Client, Preparer, Admin
Tier:           UploadAndGo='upload_and_go', Hybrid='hybrid', PremiumRemote='premium_remote'   (label(), priceRange())
ReturnStatus:   IntakeReceived, InPreparation, ReadyForReview, ESigned, EFiled      (label(), next(), nextStepText())
DocType:        W2='w2', Form1099='1099', Id='id', PriorReturn='prior_return', Other='other'
TimeWindow:     Any, Morning, Afternoon, Evening
ApptFormat:     Video, Phone, InPerson
ApptStatus:     Requested, Confirmed, Completed, Cancelled
LeadKind:       Quote, Consult
LeadStatus:     New, Contacted, Converted, Closed
ReferralStatus: Sent, SignedUp, Filed, Rewarded
InvoiceStatus:  Draft, Open, Paid, Refunded, Void
```

### 4.2 Tables
All tables use ULIDs (`HasUlids`) except Laravel's own (sessions, jobs…). Timestamps on all.

| Table / Model | Columns |
|---|---|
| `users` / `User` | `id`, `email` unique, `email_verified_at`, `password` (hashed cast), `name` null, `phone` null, `role` (Role, default client), `tier` null (Tier cast; null ⇒ "No tier selected"), `referral_code` unique (e.g. `OKJ-674SU5`), `referred_by_code` null, Fortify 2FA columns (`two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`), Cashier columns (`stripe_id`, `pm_type`, `pm_last_four`…). Uses `Billable`, `TwoFactorAuthenticatable`, `MustVerifyEmail` |
| `tax_returns` / `TaxReturn` | `id`, `user_id` FK, `tax_year` int, `tier` null, `status` (ReturnStatus, default IntakeReceived), `preparer_id` null FK users, `signed_at`, `filed_at`; unique(`user_id`,`tax_year`) |
| `status_events` / `StatusEvent` | `tax_return_id`, `from` null, `to`, `by_user_id` null, `reason` null |
| `invoices` / `Invoice` | `tax_return_id` unique, `amount_cents` null (null ⇒ "Pending quote"), `currency` default usd, `status` (InvoiceStatus), `stripe_session_id` null, `paid_at` null |
| `documents` / `Document` | `user_id`, `tax_return_id` null, `type` (DocType, default w2), `filename`, `mime`, `size_bytes`, `storage_key` (hidden attribute; never serialized), `scan_status` (pending/clean/infected), `uploaded_by` |
| `appointments` / `Appointment` | `user_id`, `preferred_date` date, `time_window` (default morning), `format` (default video), `topic` null, `notes` null, `status` (default requested), `confirmed_at` null |
| `messages` / `Message` | `to_user_id`, `from_user_id`, `body`, `read_at` null |
| `referrals` / `Referral` | `referrer_id`, `friend_name`, `friend_email`, `status`, `reward_cents` null, `source` (email/link), `friend_user_id` null; unique(`referrer_id`,`friend_email`) |
| `leads` / `Lead` | `kind`, `name`, `phone` null, `email`, `tier_interest` null, `situation` null, `preferred_date` null, `time_window` null, `format` null, `notes` null, `ref_code` null, `status` (default new) |
| `newsletter_subscribers` | `email` unique, `confirmed_at`, `unsubscribed_at` |
| `audit_logs` / `AuditLog` | `actor_id` null, `action`, `entity` null, `entity_id` null, `meta` json, `ip`, `created_at` |
| `sessions` | Laravel `database` session driver |

### 4.3 Rules
- On registration, `CreateNewUser` creates the current-year `TaxReturn` (status IntakeReceived) and an `Invoice` row (amount null). **[INFERRED from OBSERVED: stepper shows step 1 checked immediately]**
- Referral code: `{prefix}-` + 6 chars from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, retried until unique.
- Overview counts: `documents()->count()`, `referrals()->count()`.
- `Document::$hidden = ['storage_key']`; Inertia props use API Resources (`DocumentResource`, etc.) — never pass raw models.
- Eloquent strictness: `Model::shouldBeStrict()` in non-production; `Model::preventLazyLoading()`.

---

## 5. Return-status state machine

```
IntakeReceived → InPreparation → ReadyForReview → ESigned → EFiled
```
Implement as methods on the `ReturnStatus` enum (`next()`, `nextStepText()`) plus an `AdvanceReturnStatus` action class that writes a `StatusEvent`, updates the return, fires `ReturnStatusChanged` (listener queues a client notification and an AuditLog entry).
- Staff may advance/reverse (reverse requires `reason`). `ReadyForReview → ESigned` is triggered by the client's sign flow.
- UI: stages ≤ current = completed (indigo check); later = pending ring. "Next step" box uses `nextStepText()`.

| Current | Next-step text |
|---|---|
| IntakeReceived | We're moving to: In preparation. We'll keep you posted here. **[OBSERVED]** |
| InPreparation | We're moving to: Ready for review. We'll keep you posted here. |
| ReadyForReview | We're moving to: E-signed. Review your return and sign when ready. |
| ESigned | We're moving to: E-filed. We'll keep you posted here. |
| EFiled | Your return has been e-filed. Thank you! |

---

## 6. Backend implementation spec

### 6.1 Form Requests & validation (replaces zod)
One Form Request per mutating route (`app/Http/Requests/...`). Rules:

| Field | Rule |
|---|---|
| name | `required|string|min:2|max:100` (trim via `prepareForValidation`) |
| email | `required|email:rfc|max:254` (lowercase in `prepareForValidation`) |
| phone | `nullable|regex:/^[0-9 ()+\-.]{7,20}$/` |
| password | `Password::min(12)->letters()->numbers()->uncompromised()` |
| tier_interest | `nullable|in:upload_and_go,hybrid,premium_remote,not_sure` |
| tier (portal/register) | `Rule::enum(Tier::class)` |
| situation / notes | `nullable|string|max:2000`; strip tags |
| preferred_date | `required|date|after_or_equal:today|before_or_equal:+180 days` (app timezone `America/New_York`) |
| time_window | `Rule::enum(TimeWindow::class)` |
| format | `Rule::enum(ApptFormat::class)` |
| topic | `nullable|string|max:120` |
| friend_email | `required|email|different:own email|unique per referrer` |
| file | `required|file|max:25600|mimes:pdf,jpg,jpeg,png,heic,webp,xlsx,xls,csv` + magic-byte check rule (`SafeUpload`) |
| cf-turnstile-response | custom `TurnstileRule` (public forms + register) |

Errors flow back to React via Inertia's `errors` bag (`useForm`).

### 6.2 Authentication (Fortify)
- `FortifyServiceProvider`: `Fortify::loginView(fn () => Inertia::render('auth/access', ['mode' => 'signin']))`, `registerView(... 'signup')`, plus forgot/reset/verify/two-factor-challenge views.
- Features: `registration()`, `resetPasswords()`, `emailVerification()`, `updatePasswords()`, `twoFactorAuthentication(['confirm' => true, 'confirmPassword' => true])`.
- **Custom `CreateNewUser`**: validates (email unique, password rules, optional `tier`, `ref`), creates `User` (+ referral code), `TaxReturn`, `Invoice`; applies `tier`; if `ref` cookie/param matches a user's `referral_code`, sets `referred_by_code` and marks/creates the `Referral` as SignedUp; writes AuditLog.
- `Fortify::authenticateUsing` not needed; use `RateLimiter::for('login')` = 5/min per email+IP.
- `config/session.php`: `lifetime` = 20 (idle minutes), `secure` = true, `same_site` = lax, `http_only` = true.
- Regenerate session on login (Fortify default).

### 6.3 MFA enforcement (CLAIMED: "Every client account is protected with MFA")
Middleware `EnsureTwoFactorEnabled` (alias `portal.2fa`): if authenticated user lacks `two_factor_confirmed_at`, redirect to `portal.security` with a flash message — except on the security routes themselves. **Mandatory for staff immediately; for clients on first portal visit.** Challenge page uses shadcn `input-otp`; also accepts a recovery code.

### 6.4 Authorization
- Policies: `DocumentPolicy`, `AppointmentPolicy`, `MessagePolicy`, `ReferralPolicy`, `TaxReturnPolicy` — `view/delete` only when `user_id === auth id` (staff: assigned clients only; admin: all).
- Gate `access-admin` (role in preparer/admin).
- Scope portal queries via `$request->user()->documents()` relations, never global lookups. Route-model binding + `authorize()` in every action.

### 6.5 Documents
- `DocumentController@store`: validate → `Storage::disk('private')->putFile("documents/{$user->id}", $file)` with random hashed name (SSE configured on the S3 disk) → create row (`scan_status = pending`) → dispatch `ScanDocument` job (ClamAV via `clamd` socket/HTTP; stubbed interface in dev).
- `@download`: authorize; refuse unless `scan_status = clean`; `Storage::disk('private')->temporaryUrl($key, now()->addSeconds(60), ['ResponseContentDisposition' => 'attachment; filename="..."'])`; `redirect()->away()`; write AuditLog.
- `@destroy`: only while return status < ReadyForReview; deletes file + row; AuditLog.

### 6.6 Appointments / Referrals / Messages
- Appointments: create → notify staff + client; cancel only while Requested.
- Referrals: create → `ReferralInvite` mail to friend containing `route('contact', ['ref' => $code])`; reject self-referral (422) and duplicates (409 → validation error).
- Referral attribution: `Contact` visit with `?ref=` sets a 30-day cookie via `AttributeReferral` middleware; leads and registrations read it. When a referred user's return reaches EFiled → Referral `Filed` (staff then marks `Rewarded`; reward from `config('site.referral.reward_cents')` by tier).
- Messages: staff create via admin; client list ordered desc; `read` sets `read_at`. Observed UI is read-only for clients.

### 6.7 Payments (Cashier)
- `Invoice.amount_cents` set by staff. If null → UI "Awaiting quote".
- `InvoiceController@checkout`: authorize; abort 409 if amount null/paid; `return Inertia::location($request->user()->checkoutCharge($invoice->amount_cents, 'Tax preparation — '.$tier->label(), 1, ['success_url' => route('portal.overview', ['paid' => 1]), 'cancel_url' => route('portal.overview'), 'metadata' => ['invoice_id' => $invoice->id]])->url);`
- Listener on `Laravel\Cashier\Events\WebhookReceived` for `checkout.session.completed` → mark invoice Paid (idempotent), queue receipt mail, AuditLog.
- Overview states: Awaiting quote (disabled) / **Pay Now** / Paid ✓ · View receipt.
- Currency formatting in React: `Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})`.

### 6.8 E-sign (Form 8879 / Form 7216) **[CLAIMED/INFERRED]**
`SignController`: only when status = ReadyForReview. Show return summary (PDF preview), Form 7216 consent checkbox (text in `lang/en/legal.php`, counsel-reviewed), typed-name signature, capture timestamp/IP/UA, render signed PDF (DomPDF/Browsershot), store on private disk, advance to ESigned. Add code comments that wording/PIN handling must be reviewed against IRS e-file rules (Pub 1345).

### 6.9 Mail & notifications (all queued)
Mailables/Notifications (Markdown): `LeadReceived` (staff), `LeadConfirmation`, `WelcomeUser` + verify email (Fortify), `ReturnStatusChanged`, `MessagePosted` (no body in email), `AppointmentRequested`/`AppointmentConfirmed`, `ReferralInvite`, `ReferralRewarded`, `PaymentReceipt`, password reset, 2FA recovery codes notice. Never include SSNs, document contents, or return details in emails.

### 6.10 Rate limits & spam
```php
RateLimiter::for('public-forms', fn (Request $r) => Limit::perHour(5)->by($r->ip()));
```
Apply `throttle:public-forms` + Spatie honeypot + `TurnstileRule` to leads, newsletter, register.

### 6.11 Shared Inertia props (`HandleInertiaRequests`)
```
site            from config/site.php (brand, contact, offices, compliance, referral display)
auth.user       { id, email, name, tier, tierLabel, role, twoFactorEnabled } | null
flash           { success?, error? }   → rendered as shadcn Sonner toasts
ziggy/wayfinder not needed (Wayfinder is build-time)
```
Use `Inertia::share` lazily; never share documents/messages globally.

### 6.12 Audit log
`AuditLog::record($action, $entity, $meta)` helper + model observers. Events: sign-in/out, 2FA events, password change, document upload/download/delete, status change, message sent, invoice change, payment, e-sign, admin reads of client data.

### 6.13 Scheduler
Daily: prune expired password-reset tokens/sessions; retention report; (optional) reminders for incomplete intake.

---

## 7. Frontend architecture (React 19 + Inertia v3)

```
resources/
  css/app.css                  Tailwind v4 import, @theme tokens, shadcn CSS variables (see DESIGN_SYSTEM.md §1)
  js/
    app.tsx                    createInertiaApp (pages glob: ./pages/**/*.tsx)
    ssr.tsx                    Inertia SSR entry
    pages/
      home.tsx services.tsx pricing.tsx about.tsx contact.tsx legal/show.tsx
      auth/ access.tsx forgot-password.tsx reset-password.tsx verify-email.tsx two-factor-challenge.tsx
      portal/ overview.tsx documents.tsx appointments.tsx referrals.tsx messages.tsx security.tsx sign.tsx
      admin/ leads.tsx clients.tsx client-show.tsx referrals.tsx
    layouts/ marketing-layout.tsx  portal-layout.tsx  admin-layout.tsx  auth-layout.tsx
    components/
      ui/                      shadcn: button input textarea select label card badge accordion carousel dialog sheet sonner table separator skeleton progress input-otp checkbox dropdown-menu alert
      layout/                  site-header.tsx site-footer.tsx reveal.tsx logo.tsx
      marketing/               hero stats-strip tier-card tier-grid addon-table addon-cards how-it-works testimonial-carousel video-library video-card office-card office-grid referral-banner faq-list lead-quote-form consult-form newsletter-form
      portal/                  status-stepper next-step-box invoice-card stat-tile document-uploader document-list appointment-form appointment-list referral-link-box referral-form referral-list message-list portal-tabs
    hooks/                     use-reveal.ts use-copy.ts
    lib/                       utils.ts (cn), format.ts (currency/date)
    types/                     index.d.ts (Site, User, Tier, Document, Appointment, Referral, Message, Offices…)
    actions/ routes/           Wayfinder-generated (do not edit)
```

**Behavioral details**
- **Layouts via Inertia persistent layouts** (`Page.layout = ...`). `marketing-layout` = Header + Footer; `portal-layout` = Header + welcome block + tier badge + tabs + Footer; auth pages use `marketing-layout` (guest header variant).
- **Header** reads `auth.user` from shared props: guest → "Client Login" + "Start My Return Online"; authed → "My Portal" + "Sign out" (`<Link method="post" as="button">` to `/logout`). Mobile nav uses shadcn **Sheet**.
- **Forms** use Inertia `useForm` (or the `<Form>` component) with Wayfinder route helpers; field errors from `errors`; `processing` drives button pending text; success via flash → Sonner toast, or an inline success panel for public lead forms (read `flash`/`recentlySuccessful`).
- **Auth card** (`auth/access.tsx`): receives `mode`; toggle links are Inertia `<Link href="/register">`/`/login` (preserve `tier`/`next` query). Title stays "Sign in to Okojie Online" in both modes (observed). Inputs have `aria-label` since no visible labels.
- **Accordions:** shadcn Accordion (`type="multiple"`).
- **Testimonials:** shadcn **Carousel** (Embla) with `CarouselPrevious/Next` styled as 36px outlined circles; 3 slides per view ≥1024, 1 on mobile.
- **Video card:** thumbnail + play button → shadcn Dialog with `<video controls>` or privacy-enhanced iframe; no URL ⇒ disabled "Coming soon".
- **Portal tabs:** Inertia `<Link>`s styled as a segmented control; active when `url.startsWith(href)`; `aria-current="page"`.
- **Document uploader:** `useForm({ type, file })`, `forceFormData`, drag-and-drop zone + hidden `<input type=file>` + visible "Browse files" button; show `progress` using shadcn Progress.
- **Downloads:** plain `<a href>` (not Inertia) so the browser follows the 302 to the signed URL.
- **Copy button:** `navigator.clipboard.writeText`; label "Copied" for 2 s.
- **Dates:** native `<input type="date">` (observed). Send `YYYY-MM-DD`.
- **Reveal animation:** `<Reveal>` with IntersectionObserver; honors `prefers-reduced-motion`; content visible when JS/SSR-hydration absent.
- **SSR:** enabled for all public pages; guard browser-only APIs (`window`, `IntersectionObserver`) inside effects.
- **Metadata:** Inertia `<Head>` per page (title template `"{Page} | Okojie Online"`, description, OG, JSON-LD scripts). `noindex` meta on auth/portal/admin plus `X-Robots-Tag` middleware.

---

## 8. Security & compliance spec

These support the site's **[CLAIMED]** statements; they are not a certification.

**Authentication & sessions** — Fortify with bcrypt/argon2id (`config/hashing.php` → argon2id), generic error messages, login throttling, session regeneration, idle timeout 20 min (`SESSION_LIFETIME=20`) plus absolute 12 h via middleware, `Secure`/`HttpOnly`/`SameSite=Lax` cookies, **Fortify two-factor (TOTP) + 8 recovery codes**, `confirmPassword` before sensitive changes.

**Authorization** — Policies on every portal/admin resource; tests for IDOR across all five portal tabs.

**Data protection** — TLS + HSTS; DB encryption at rest at the provider; S3 SSE-KMS; private disk only, random keys, **temporary URLs ≤ 60 s**; ClamAV scanning; EXIF stripping for images; if SSN/TIN fields are ever stored use `encrypted` Eloquent casts and masking (avoid storing if possible). Encrypted backups with tested restores and a retention schedule set with counsel (IRS preparers generally retain returns at least 3 years).

**Application security** — Laravel CSRF (Inertia sends the XSRF cookie/header automatically); CSP + security headers middleware (`default-src 'self'`; allow Stripe, Cloudflare Turnstile; nonce for inline JSON-LD), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal; rate limiting; Eloquent mass-assignment guarded (`$fillable`); never output unescaped user HTML; `composer audit` + `npm audit` in CI; secrets only in env.

**Compliance artifacts outside code** — WISP (IRS Pub 4557 / FTC Safeguards Rule: coordinator, risk assessment, safeguards, vendor oversight, incident response, annual review); Form 7216 consent language and Form 8879 handling reviewed by counsel (IRS Pub 1345 if an Authorized e-file Provider); privacy policy and terms; CAN-SPAM unsubscribe; PA/MD breach-notification procedure.

---

## 9. Accessibility spec

- Body text contrast ≥ 4.5:1 on dark surfaces (muted text never below ~#9ea1b3 on #1c1d2a).
- Every input has a programmatic label (use shadcn `Label`; `aria-label` where the design shows none).
- Focus ring: 2px indigo (`--ring`) with 2px offset on all interactive elements.
- shadcn Accordion/Dialog/Sheet/Carousel supply ARIA semantics — keep their roles; label prev/next buttons and play buttons (`aria-label="Play: {title}"`).
- Portal tabs: `aria-current="page"`.
- Errors linked via `aria-describedby`, announced in `aria-live="polite"`.
- Reduced motion: disable reveal/transform transitions.

---

## 10. SEO & metadata

- Default `<title>`: "Okojie & Associates, Inc. — Okojie Online Tax Preparation"; per-page `"{Page} | Okojie Online"`.
- Home meta description: "The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Secure portal, e-sign, and e-file with Okojie & Associates." **[OBSERVED]**
- Open Graph/Twitter tags with hero image.
- JSON-LD in `<Head>`: `AccountingService`/`LocalBusiness` per office, `FAQPage` for FAQ blocks, `Organization`.
- `noindex` on `/login`, `/register`, `/portal/*`, `/admin/*`.
- `/sitemap.xml` route (or `spatie/laravel-sitemap`), `public/robots.txt`.
- **Inertia SSR is required** (the original is client-rendered, which hurts SEO).

---

## 11. Seed data & fixtures

Seeders (`database/seeders`):
- `DemoClientSeeder`: `client@example.com` / `Passw0rd!ChangeMe` — role client, no tier, TaxReturn IntakeReceived, Invoice $225 (22500 cents) to reproduce the observed screenshots exactly, 0 documents, 0 referrals, 2FA not yet enabled.
- `StaffSeeder`: `preparer@example.com`, `admin@example.com`.
- `DemoActivitySeeder` (optional flag): sample documents/messages/appointments/referrals.
- Factories for all models.
Marketing content is in `config/*.php` (no seeding needed).

---

## 12. Testing plan (Pest 4)

- **Unit:** referral-code generator, `ReturnStatus` transitions/next-step text, currency/date formatters, validators (`SafeUpload`, `TurnstileRule` with `Http::fake`).
- **Feature (HTTP + Inertia assertions `assertInertia`):** each page returns the right component and props; lead forms persist and email (`Mail::fake`/`Notification::fake`); register creates User+TaxReturn+Invoice+referral code and applies `tier`/`ref`; login throttling; 2FA enforcement redirect; documents upload/download/delete rules; appointments; referrals (self/duplicate rejection); invoice checkout (Stripe faked); webhook idempotency; **policy tests: user A cannot view/download/delete user B's documents, appointments, messages, referrals**.
- **Browser (Pest browser plugin):** journeys J1–J5 from PRD; nav state swap; auth mode toggle; FAQ expand; carousel arrows; each portal tab's empty-state copy equals `CONTENT.md`; upload rejects bad files; copy button.
- **Visual:** screenshots at 1440/1024/768/390 per page vs. provided screenshots.
- **A11y:** axe-core run in browser tests; keyboard-only pass.
- **Static analysis / style:** Larastan (high level), Pint, `tsc --noEmit`, ESLint, Prettier. CI runs `composer test` + `npm run lint && npm run types && npm run build`.

---

## 13. Environment variables

```
APP_NAME="Okojie Online"  APP_URL=http://okojie-online.test  APP_TIMEZONE=America/New_York
DB_CONNECTION=pgsql  DB_HOST= DB_PORT=5432 DB_DATABASE= DB_USERNAME= DB_PASSWORD=
SESSION_DRIVER=database  SESSION_LIFETIME=20  SESSION_SECURE_COOKIE=true
QUEUE_CONNECTION=database   CACHE_STORE=redis (or database)
FILESYSTEM_DISK=local  PRIVATE_DISK=s3
AWS_ACCESS_KEY_ID= AWS_SECRET_ACCESS_KEY= AWS_DEFAULT_REGION= AWS_BUCKET= AWS_ENDPOINT= AWS_KMS_KEY_ID=
MAIL_MAILER=log|resend|postmark  MAIL_FROM_ADDRESS=hello@okojieonline.com  MAIL_FROM_NAME="Okojie Online"  RESEND_API_KEY=  STAFF_NOTIFY_EMAIL=
STRIPE_KEY= STRIPE_SECRET= STRIPE_WEBHOOK_SECRET= CASHIER_CURRENCY=usd
TURNSTILE_SITE_KEY= TURNSTILE_SECRET_KEY=
CLAMAV_HOST= CLAMAV_PORT=3310
INERTIA_SSR_ENABLED=true  INERTIA_SSR_URL=http://127.0.0.1:13714
VITE_APP_NAME="${APP_NAME}"
```

---

## 14. Local development & commands

```
composer install && npm install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed
php artisan wayfinder:generate --with-form     # typed route helpers (also runs via Vite plugin if configured)
composer dev                                   # server + queue + logs + vite (starter-kit script)
npm run build && php artisan inertia:start-ssr # SSR check
php artisan test                               # Pest
./vendor/bin/pint && npm run lint && npm run types
npx shadcn@latest add button input textarea select label card badge accordion carousel dialog sheet sonner table separator skeleton progress input-otp checkbox dropdown-menu alert
```