# FEATURES — Complete Inventory with Acceptance Criteria

Tags: **[OBSERVED] [INFERRED] [CLAIMED] [DRAFTED]**. Priority: **P0** must-have for parity, **P1** needed to function, **P2** nice-to-have.

---

## A. Global / Layout

### A1. Header / Primary navigation — P0 [OBSERVED]

- Left: circular indigo logo mark containing "O", wordmark "Okojie & Associates, Inc." with small sub-label "Okojie Online". Clicking → `/`.
- Center links: Home, Services, Pricing, About, Contact.
- Right, **logged out**: text link "Client Login" → `/login`; filled pill button "Start My Return Online" → `/contact` (scroll to the quote form).
- Right, **logged in**: text link "My Portal" → `/portal`; outlined pill button "Sign out".
- Header has a 1px bottom border; sticky behavior is **[INFERRED]** (recommended: sticky).
- Active link state: **[INFERRED]** subtle highlight.
- **AC:** Auth state swaps right-side items without a page reload after sign-in/out. Mobile: collapses to a hamburger menu with the same items.

### A2. Footer — P0 [OBSERVED]

- Three columns: (1) logo + tagline "The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Serving individuals, families, and small businesses for 26+ years." + newsletter form; (2) "Explore": Home, Services, Pricing, About, Contact, Client Login; (3) "Offices": four street addresses with city/state.
- Newsletter: pill input placeholder "Email for tax tips & deadlines" + "Subscribe" button.
- Bottom bar: left "© 2026 Okojie & Associates, Inc. All rights reserved." (fix the original's double period; make the year dynamic); right "IRS Publication 4557 & FTC Safeguards compliant · Written Information Security Plan (WISP)".
- **AC:** Subscribe validates email, POSTs, shows inline success ("Thanks — you're subscribed") or error; duplicates are idempotent.

### A3. Scroll-reveal animation — P2 [OBSERVED]

Sections and cards fade/slide in on scroll (screenshots captured mid-fade). **AC:** Uses IntersectionObserver in a React `<Reveal>` wrapper; SSR-safe; respects `prefers-reduced-motion`; content is never hidden if JS fails.

### A4. Page chrome — P0

Dark theme throughout, max content width ≈ 1160px centered, section separators as 1px horizontal rules.

---

## B. Home page (`/`) [OBSERVED]

### B1. Hero — P0

- Background: dark city-skyline-at-dusk photo with heavy dark overlay.
- Pill badge: "26+ years · Philadelphia & Baltimore".
- H1: "The convenience of online filing, with a real tax professional."
- Sub: "Okojie Online brings 26+ years of Philadelphia and Baltimore tax expertise to a secure, fully remote experience — upload, review, e-sign, and file without leaving home."
- CTAs: primary "Start My Return Online" (→ `/contact`), secondary outlined "Book a Free Consultation" (→ `/contact#consult`).
- Trust row with small icons: "Secure client portal", "Credentialed preparers", "Local PA & MD knowledge".

### B2. Stats strip — P0

Four stats: **26+** Years in business · **40,000+** Returns filed · **12** Credentialed preparers · **4** Offices in PA & MD.

### B3. "Three ways to file" — P0

- H2 "Three ways to file"; sub "Pick the level of support that fits — every tier includes a real, credentialed preparer."
- Three tier cards (Upload & Go, Hybrid, Premium Remote) — same content as Pricing. Each shows name, tagline, "starting at $X–$Y", feature checklist, "Best for" box, button "Choose {Tier}".
- Link below: "See full pricing and what's included →" → `/pricing`.

### B4. "How it works" — P0

H2 "How it works"; sub "Five steps from start to filed — no office visit required." Five numbered cards ("STEP 1"…):

1. **Book** — "Choose a service tier and book online in minutes." [OBSERVED]
2. **Upload** — "Securely upload your documents to your private portal." [OBSERVED]
3. **Prepare** — [DRAFTED] "A credentialed preparer builds your federal and state return."
4. **Review & e-sign** — [DRAFTED] "Review your return by video or phone, then sign electronically (Form 8879)."
5. **E-file** — [DRAFTED] "We e-file and you pay online. Track everything in your portal."

### B5. Testimonials carousel — P0

H2 "What clients say"; sub "Real families and business owners across Philadelphia and Baltimore." Three visible cards, five gold/indigo stars each, quote, name + location. Prev/next circular arrow buttons on left/right. Names: Denise R. (Germantown, Philadelphia), Marcus T. (Baltimore, MD), Priya S. (Cherry Hill, NJ). Full quotes in `CONTENT.md`.
**AC:** Arrows advance one card (shadcn Carousel / Embla); keyboard accessible; swipe on mobile.

### B6. "Watch & Learn" video library — P0

H2 "Watch & Learn"; sub "Short videos on getting started, using your portal, and hearing from clients." Three groups with H3 and two video cards each:

- **Getting Started:** "How Okojie Online Works", "Choosing the Right Service Tier"
- **How-To / Portal Guides:** "How to Upload Your Documents", "How to E-Sign Form 8879"
- **Client Stories:** "Denise's Story", "Marcus on IRS Notices"
  Each card: 16:9 thumbnail with centered circular play button, title, description ending "Sample video; replace with your own."
  **AC:** Click play opens inline player or modal; data-driven so real video URLs can be dropped in.

### B7. "Find us in person" — P0

H2 + sub "Three Philadelphia offices and one in Baltimore — or work with us entirely online." Four office cards (see C-offices).

### B8. Referral banner — P0

Panel with badge "Refer a Friend", H2 "Earn $25–$50 for every friend you refer", body "Know someone who dreads tax season? Send them our way. When they file with Okojie Online, you earn a reward — and they get a real tax professional who knows Philadelphia and Baltimore." Buttons "Get my referral link" (→ portal Referrals if logged in, else `/login`) and "Refer someone now" (→ same). Right column: two mini-cards: "Share your link — Every client gets a unique referral code and link in their portal." and "They file, you earn — When your friend becomes a client, you earn $25–$50."

### B9. Quote form block — P0

Same component as Contact's "Start My Return Online" (see D1).

### B10. FAQ accordion — P0

Eight questions (see `CONTENT.md`). Single-column, centered, chevron right, border-bottom separators. **AC:** One open at a time or independent (choose independent); `aria-expanded`; chevron rotates.

---

## C. Shared components

### C1. Tier card — P0 [OBSERVED]

Fields: name, tagline, price range (small "starting at" + large range), description, 5 feature bullets with check icons, "Best for" callout (darker rounded box), CTA button full-width pill.
**CTA behavior [INFERRED]:** If logged out → `/register?tier={slug}` (Inertia link); if logged in → `PATCH /portal/tier` sets the account tier and redirects to `/portal/overview`. Tier then shows in the portal header badge (replacing "No tier selected").

### C2. Offices — P0 [OBSERVED]

| #                                                                                                                                                                 | City             | Address                  | Phone          | Hours                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------ | -------------- | ------------------------------ |
| 1                                                                                                                                                                 | Philadelphia, PA | 5601 Germantown Ave      | (215) 555-0142 | Mon–Fri 9am–6pm · Sat 10am–2pm |
| 2                                                                                                                                                                 | Philadelphia, PA | 2301 N. Broad St         | (215) 555-0178 | Mon–Fri 9am–6pm                |
| 3                                                                                                                                                                 | Philadelphia, PA | 6300 W. Chelten Ave      | (215) 555-0193 | Mon–Fri 9am–5pm · Sat 10am–1pm |
| 4                                                                                                                                                                 | Baltimore, MD    | 4100 Liberty Heights Ave | (410) 555-0166 | Mon–Fri 9am–6pm                |
| Card: map-pin icon + city (bold), address, divider, phone icon + number, clock icon + hours. Grid: 4 columns desktop, 2 tablet, 1 mobile. Phone is a `tel:` link. |

### C3. FAQ accordion — P0 [OBSERVED]

Reusable; appears on Home, Services ("Frequently asked questions"), Pricing ("Pricing questions"). Same 8 questions on all three.

### C4. Lead forms — see D1/D2.

---

## D. Contact page (`/contact`) [OBSERVED]

- H1 "Get in touch"; sub "Start your return online, book a free consultation, or reach us at any of our four offices."
- Three info cards: **Call us** (215) 555-0142 · **Email** hello@okojieonline.com · **Hours** Mon–Fri 9am–6pm.

### D1. "Start My Return Online" quote form — P0

Left column copy: H2 "Start My Return Online"; "Tell us about your situation and a preparer will follow up within one business day."; bullets "No obligation, no pressure", "A real preparer reviews your situation", "Your information stays private and secure".
Right column fields: **Full name** (required), **Phone**, **Email** (required, validated), **Service tier interest** (select, placeholder "Select a tier": Upload & Go, Hybrid, Premium Remote, Not sure), **Brief situation** (textarea, placeholder "W-2 employee, self-employed, back taxes, etc."). Submit: "Request my free quote".

- **AC:** Laravel Form Request validation (errors returned to the Inertia form); stores Lead(kind=QUOTE); emails staff + confirmation to user; success replaces form with confirmation message; honors `?ref=CODE` (stored on lead); honors `?tier=` to preselect.
- Variant on `/services`: heading "Not sure which tier fits?", body "Send us your situation and a preparer will recommend the right service — no obligation."

### D2. "Book a free consultation" form — P0

Card heading "Book a free consultation". Fields: Full name, Phone, Email, **Preferred date** (date input), **Time window** (select, default "Any": Any, Morning, Afternoon, Evening), **Format** (select, default "Video call": Video call, Phone call, In person), **Notes** (textarea). Submit "Request consultation".

- **AC:** Date cannot be in the past; Lead(kind=CONSULT) stored; confirmation shown; staff confirm by email.

### D3. Offices section — P0 (C2).

---

## E. Services page (`/services`) [OBSERVED]

- H1 "Services"; sub "From a simple W-2 return to multi-state small-business filings — choose the tier that matches your situation, and add specialized help when you need it."
- Tier cards (C1).
- **Add-ons table** — H2 "Add-ons"; sub "Available with any tier. Priced as ranges depending on complexity." Table columns: Service · What it covers · Starting at. Rows:
    - Prior-year amendments — Amend a previously filed return to claim missed credits or correct errors. — $150–$500
    - IRS notice response — We read the notice, respond on your behalf, and keep you informed. — $125–$400
    - ITIN applications — New or renewed ITIN applications with certified documentation review. — $150–$300
    - Bookkeeping — Monthly bookkeeping for small businesses and self-employed clients. — $100–$500
    - Quarterly estimates — Estimated tax calculations and payment reminders each quarter. — $75–$250
- Quote form (variant) and FAQ ("Frequently asked questions").

---

## F. Pricing page (`/pricing`) [OBSERVED]

- H1 "Transparent pricing"; sub "Fees are shown as starting ranges. You will always know your exact price before we file — no surprises."
- Tier cards (C1).
- **Add-ons as 2-column card grid** (not table): each card has title + price (indigo, right-aligned) + description. Fifth card sits alone in the left column. Heading "Add-ons"; sub "Add any of these to your tier."
- FAQ H2 "Pricing questions".

---

## G. About page (`/about`) [OBSERVED]

- H1 "A neighborhood firm, now online"; body "Okojie & Associates, Inc. has prepared tax returns for Philadelphia and Baltimore families and small businesses for over 26 years. Okojie Online is the same firm — the same credentialed preparers — with a secure, fully remote way to work with us."
- Wide rounded team photo (four professionals around a table with documents).
- Stats row (left-aligned numbers): **26+** Years serving PA & MD taxpayers · **40,000+** Returns prepared and filed · **4** Offices across Philadelphia & Baltimore.
- H2 "Your data is protected"; sub "Security is not an afterthought — it is built into every step of how we work." Four cards with indigo line icons:
    1. **IRS Publication 4557** — "We follow the IRS's data-security guidance for tax professionals."
    2. **FTC Safeguards Rule** — "A written information security plan (WISP) governs how we protect client data."
    3. **Multi-factor authentication** — "Every client account is protected with MFA."
    4. **IRS-compliant e-signature** — "Form 8879 e-file authorization with Form 7216 consent."
- "Find us in person" offices (C2).

---

## H. Authentication (`/login`) [OBSERVED]

### H1. Combined sign-in / sign-up card — P0

- Centered card (~400px). Badge: shield-check icon + "Secure client portal". H1 "Sign in to Okojie Online"; sub "Upload documents, review your return status, e-sign, and pay — all in one place."
- Fields: email (placeholder `you@example.com`), password (placeholder "Password"). No visible labels, no show/hide, no "forgot password" **(add these as [INFERRED] improvements: label via aria-label, show/hide toggle, "Forgot password?")**.
- **Sign-in mode:** primary button "Sign in"; toggle text "Need an account? Sign up".
- **Sign-up mode:** same heading and fields; button "Create account"; toggle "Have an account? Sign in".
- Below card: "New here? Start your return online or create an account above." ("Start your return online" is an indigo link → `/contact`.)
- Header in this state shows "Client Login" + "Start My Return Online".
- **Routing:** `/login` renders sign-in mode and `/register` renders sign-up mode of the **same Inertia page** (`auth/access`); `/login?mode=signup` redirects to `/register`. Toggle links preserve `?tier=` and `?next=`.
- **AC:** Wrong credentials → generic error; weak password rejected with rules; successful sign-in/up → `/portal`; duplicate email → friendly error without account enumeration; rate-limited (Fortify/RateLimiter); **[CLAIMED]** Fortify two-factor challenge after password for accounts with MFA enabled (see SPEC §6.3).

---

## I. Client portal (`/portal`) [OBSERVED]

Auth-guarded. Header block: small "Welcome back" label, large user email as title (use name if present), right-aligned pill badge showing chosen tier or "No tier selected". Segmented tab control (rounded container; active tab has darker raised pill): **Overview · Documents · Appointments · Referrals · Messages**. Tabs map to `/portal/overview` etc. (or `?tab=`); default Overview.

### I1. Overview — P0

- **Your return status** card: vertical stepper with five items — Intake received, In preparation, Ready for review, E-signed, E-filed. Completed = indigo ring with check; pending = grey ring. New account starts at Intake received (checked).
- **NEXT STEP** box: "We're moving to: {next stage}. We'll keep you posted here." (Text varies by stage: **[INFERRED]** at Ready for review → "Your return is ready — review and e-sign"; at E-signed → "Pay your fee and we'll e-file"; at E-filed → "Your return has been filed.")
- **Invoice** card: "Invoice", "Your fee for your return.", amount (large, e.g. `$225`), full-width "Pay Now" button with card icon. **[INFERRED]** shows "Pending quote" when no fee is set; after payment shows "Paid" + receipt.
- Two stat tiles: document icon + count + "Documents"; gift icon + count + "Referrals".

### I2. Documents — P0

- Left card "Upload a document": note "Only you and your preparer can see these files."; **Document type** select (default W-2; **[INFERRED]** options W-2, 1099, ID, Prior return, Other); dashed drop zone with cloud-upload icon, "Drag & drop or click to upload", helper "W-2, 1099, ID, prior return — PDF, image, or spreadsheet".
- Right card "Your documents": empty state "No documents yet. Upload your first one to get started." Otherwise list rows: icon, filename, type chip, size, upload date, download, delete (delete only before return is "Ready for review").
- **AC:** Accepts PDF, JPG, PNG, HEIC, XLSX, CSV; max 25 MB each (**[INFERRED]**); progress bar; virus scan; encrypted storage; counts update on Overview.

### I3. Appointments — P0

- Left card "Request an appointment": **Preferred date** (date), **Time window** (default Morning: Morning, Afternoon, Evening), **Format** (default Video: Video, Phone, In person), **Topic** (text, placeholder "Return review, planning, IRS notice..."), **Notes** (textarea). Button with calendar-plus icon "Request appointment".
- Right card "Your appointments": empty "No appointments yet." Otherwise list with date, window, format, topic, status chip (Requested / Confirmed / Completed / Cancelled).

### I4. Referrals — P0

- Left card "Refer a friend": "Share your link — you earn $25–$50 when they file."; read-only monospace field containing `{origin}/contact?ref={CODE}` with "Copy" button (copies, then shows "Copied"); Friend's name; Friend's email; button with paper-plane icon "Send referral".
- Right card "Your referrals": empty "No referrals yet. Share your link to get started." Otherwise list: friend name, status (Sent / Signed up / Filed / Rewarded), reward amount.
- Code format: `OKJ-` + 6 uppercase alphanumerics (e.g. `OKJ-674SU5`).

### I5. Messages — P0

- Single wide card "Messages from your preparer"; empty "No messages yet. Your preparer will post updates here as your return progresses." Otherwise chronological list (sender, timestamp, body, unread dot).
- Observed UI is read-only. **[INFERRED, P2]** add reply box.

---

## J. Staff/Admin console [INFERRED] — P1 (required for the portal to be real)

- **J1 Leads inbox:** filter by kind (quote/consult), status (new/contacted/converted/closed); assign; notes; convert to client.
- **J2 Clients list + detail:** profile, tier, preparer, documents, appointments, messages, referral info, invoice, audit trail.
- **J3 Return status control:** advance/reverse the 5-stage status; triggers client email + auto "Next step" text.
- **J4 Messaging:** post message to a client; optional email notification.
- **J5 Appointments:** confirm/reschedule/cancel with email.
- **J6 Documents:** view/download; request additional doc.
- **J7 Invoicing:** set fee; mark paid offline; refund.
- **J8 Referrals:** mark Filed → Rewarded; export payouts.
- **J9 Content (P2):** edit offices, FAQs, testimonials, videos, tier prices.
- **J10 Roles:** Admin, Preparer, (Client). Preparers only see assigned clients.

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

## L. Traceability: screenshot → feature

| Screenshot                       | Features                  |
| -------------------------------- | ------------------------- |
| Homepage                         | A1–A3, B1–B10             |
| Services                         | E, C1, C3, D1 variant     |
| Pricing                          | F, C1, C3                 |
| About                            | G, C2                     |
| Contact (signed in / signed out) | D, C2 (nav state differs) |
| Login / Register                 | H                         |
| Portal – Overview                | I1                        |
| Portal – Documents               | I2                        |
| Portal – Appointments            | I3                        |
| Portal – Referrals               | I4                        |
| Portal – Messages                | I5                        |
