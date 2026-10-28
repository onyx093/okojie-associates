# UI State Matrix

> **Approvals update.** All backend change requests were approved (`BACKEND-CHANGE-REQUESTS.md`). Wherever a row below says _fallback_, _hidden_, _🅱_, _no counts_, _omitted_ or _not built_, treat that as the **interim** wording: after the BE prompts run, implement the **real** behavior from the approved spec (overview extras, stage dates, new next-step copy, receipt number + card, appointment time + Join call, message attachments + preparer card, return summary, devices, avatar/title/office, nav badges, admin metrics/filters/export/invite, lead counts/search/convert-with-invite-email, referral totals/tabs, verify-email live). Verification is by fixtures **and** Pest browser tests (`tests/Browser/*`). Still unchanged: no Download-PDF package (DR-09 pending → print), passkeys use the existing components, the 403 state exists, 503 uses the Inertia error page.

Every state the mockups define (via the dark **Mockup states** panel, `data-when` / `data-state` blocks, or inline scripts), mapped to **how a real user reaches it** and **how to verify it**. The migration prompts require each row to be implemented and checked.

**Rules**

- The mockup state panel is **not** built. States are driven by real Inertia props, query strings, or local UI state.
- Each page is split into a thin Inertia wrapper (`pages/…`) and a presentational view (`components/…/…-view.tsx`) that takes explicit props. Fixtures for every state live in `resources/js/dev/fixtures/<page>.ts` and render in the local-only `/dev/styleguide` page (no backend change). The wrapper only maps `usePage().props` → view props.
- Verification = (a) fixture renders in styleguide in **light and dark**, (b) the page's existing narrow Pest feature tests still pass (prop shape is frozen; no new tests for pure styling), (c) a **manual check** from the checklist (no browser/E2E tooling is installed — DR-06). ✔ = required for the row.
- **Light / dark / mobile (390px)** apply to every row and are implied.
- 🅱 = depends on an unapproved Backend Change Request (BCR); until approved, implement the **fallback** from `BACKEND-CHANGE-REQUESTS.md` and mark the row "fallback". ✅ = verified already supported by the backend.

Legend: **Fx** = fixture on the `dev/styleguide` page · **Fe** = existing narrow Pest feature test must pass · **M** = manual check (keyboard / visual / console via Boost `browser-logs`).

---

## 1. Public site

### Home (`home.html` → `pages/home.tsx`, components `components/home/*`)

| State                                                                                          | Reached by                                  | Expected UI                                                                                                 | Fx  | Fe  | M   |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --- | --- | --- |
| Guest nav                                                                                      | not signed in                               | "Client login" + "Start my return"; mobile sheet shows same                                                 | ✔   | ✔   | ✔   |
| Authed nav                                                                                     | signed in                                   | "My portal" (+ "Sign out" in sheet)                                                                         | ✔   | ✔   | ✔   |
| Hero photo layer (D-08)                                                                        | `public/images/hero.webp` present / missing | present → decorative photo under the sky veil, text contrast kept in both themes; missing → sky-only hero   | ✔   |     | ✔   |
| Tier CTA guest / authed                                                                        | click "Choose …"                            | guest → `/register?tier=slug`; authed → `PATCH portal.tier.update` then redirect                            | ✔   | ✔   | ✔   |
| Referral CTA guest / authed                                                                    | click                                       | guest → `/register?next=/portal/referrals`; authed → `/portal/referrals`                                    | ✔   |     | ✔   |
| Video tabs                                                                                     | tab click / arrow keys                      | `role=tab`, only selected panel visible, `tabIndex` roving; modal opens video                               | ✔   |     | ✔   |
| Video without URL                                                                              | `url` empty                                 | disabled "Coming soon"                                                                                      | ✔   |     |     |
| Intake form: idle / invalid / submitting / success / server error / throttled (429) / honeypot | submit                                      | inline field errors with `aria-describedby`; button "Sending…"; success panel replaces form; toast on error | ✔   | ✔   | ✔   |
| Prefill from `?tier=` and `?ref=`                                                              | query                                       | tier chip preselected; ref cookie set                                                                       | ✔   | ✔   |     |
| FAQ open/closed                                                                                | click                                       | plus tile rotates; first item open by default                                                               | ✔   |     | ✔   |
| Newsletter: idle / invalid / success                                                           | footer form                                 | inline message, `role=status`                                                                               | ✔   | ✔   | ✔   |
| Theme: light / dark / system                                                                   | toggle                                      | icon crossfade; persisted; no flash on reload                                                               | ✔   |     | ✔   |

### Services (`services.html` → `pages/services.tsx`)

| State                              | Reached by    | Expected UI                                                       | Fx  | M   |
| ---------------------------------- | ------------- | ----------------------------------------------------------------- | --- | --- |
| Tier finder – default              | load          | W-2 / Fully online / Just one → **Upload & Go**, "$150–$225"      | ✔   | ✔   |
| Tier finder – all 16 answer combos | change radios | Result per truth table below, live `role=status aria-live=polite` | ✔   | ✔   |
| Featured tier row                  | Hybrid        | "Most popular" chip, primary CTA + "Book a free consultation"     | ✔   |     |
| FAQ first item open                | load          |                                                                   | ✔   |     |
| "Help me choose"                   | click         | smooth-scroll to `#guide`                                         |     | ✔   |

**Tier finder truth table** (D-02 option 2 — corrected logic; supersedes the mockup's Hybrid override):

| Income                                                                                                                                                                                                                                      | Meet   | States                                                                                                             | Result             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ | ------------------ |
| w2                                                                                                                                                                                                                                          | remote | one                                                                                                                | Upload & Go        |
| w2                                                                                                                                                                                                                                          | office | one                                                                                                                | Hybrid             |
| w2                                                                                                                                                                                                                                          | any    | multi                                                                                                              | Premium Remote     |
| se / rent / mix                                                                                                                                                                                                                             | any    | any                                                                                                                | **Premium Remote** |
| Rule in code: `inc !== 'w2'                                                                                                                                                                                                                 |        | states === 'multi' ? premium : meet === 'office' ? hybrid : upload`. Cover all 16 combinations with a Vitest test. |
| Reasons: Upload & Go → "A straightforward return you can finish from home." · Hybrid → "You'd like to sit down with a preparer, in person or by video." · Premium → "Self-employment, rentals or several states need a dedicated preparer." |

### Pricing (`pricing.html` → `pages/pricing.tsx`)

| State                                  | Expected UI                                                                      | Fx  | M   |
| -------------------------------------- | -------------------------------------------------------------------------------- | --- | --- |
| Compare table desktop                  | 4 columns, Hybrid column highlighted ("Most popular"), ✓ / — cells, grouped rows | ✔   | ✔   |
| Compare table narrow                   | horizontal scroll inside the card, sticky first column                           | ✔   | ✔   |
| Add-on strip / how-payment-works cards | 5-up → wraps; 3 numbered cards                                                   | ✔   |     |
| FAQ (3 items, first open)              |                                                                                  | ✔   |     |

### About (`about.html` → `pages/about.tsx`)

Stats 4-up (2×2 on phones) · team 4-up → 2 → 1 · security 4 cards · offices 4 cards · visible note "Sample team. Replace with real names, titles and photos." (D-05). Fx ✔.

### Contact (`contact.html` → `pages/contact.tsx`)

| State                                           | Reached by                                | Expected UI                                                                                                                                                             | Fx  | Fe  | M   |
| ----------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- | --- |
| Quote tab (default)                             | load, or `#start`                         | tier chips (Upload & Go / Hybrid / Premium Remote / Not sure), situation textarea, button "Request my free quote"                                                       | ✔   |     | ✔   |
| Consultation tab                                | click tab, `?type=consult`, or `#consult` | date, time select (Any time / Morning (9am–12pm) / Afternoon (12pm–4pm) / Evening (4pm–6pm)), format chips (Video / Phone / In person), button "Request a consultation" | ✔   |     | ✔   |
| Defaults (D-03)                                 | load                                      | Quote: tier **Hybrid** pre-selected (`?tier=` overrides); Consultation: format **Video**, time **Any time**, date empty (min today)                                     | ✔   |     | ✔   |
| Tab switch keeps shared fields                  | switch with typed name/email              | values preserved                                                                                                                                                        |     |     | ✔   |
| Validation errors per tab                       | submit empty                              | inline errors; quote posts to `leads.quote`, consult to `leads.consult`                                                                                                 | ✔   | ✔   | ✔   |
| Submitting / success / throttled / server error |                                           | "Thanks! A preparer will be in touch within one business day." toast + form reset                                                                                       | ✔   | ✔   | ✔   |
| `?ref=` / `?tier=`                              | query                                     | stored / preselected                                                                                                                                                    |     | ✔   |     |
| Directions button                               | click                                     | opens maps search for the office address (new tab)                                                                                                                      |     |     |     |

### Legal (`legal-privacy|terms|security.html` → `pages/legal/{privacy,terms,security}.tsx`)

Draft banner (`role=note`) · TOC with anchors (sticky on desktop, collapsed list on phones) · "Last updated" + Print button · numbered `h2`s (`01 …`) · active TOC item on scroll (optional) · anchors scroll below sticky header. Fx ✔ for each of 3 documents.

### Error (`error.html` → `pages/error.tsx`)

| State                                                | Title                              | Body                                                                                                  | Primary      | Secondary       |
| ---------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------ | --------------- |
| 404                                                  | We can't find that page            | The link may be old or mistyped. Your documents and return are safe.                                  | Back to home | Client portal   |
| 419                                                  | Your session expired               | For your security, we sign you out after a period of inactivity. Refresh the page and try again.      | Refresh page | Back to home    |
| 500                                                  | Something went wrong on our end    | We've been notified and are looking into it. Please try again in a few minutes.                       | Try again    | Back to home    |
| 503 ✅ BCR-20 (Inertia error page; maintenance mode) | We'll be right back                | We're doing scheduled maintenance on the portal. It should only take a few minutes.                   | Refresh page | Call the office |
| 403 (D-11)                                           | You don't have access to this page | This page is only available to the right account. If you think this is a mistake, contact the office. | Back to home | Client portal   |
| `document.title` updates per code. Fx ✔ (all five).  |

---

## 2. Authentication (split layout)

| Page                                                                  | State                                                                                | Reached by                     | Expected UI                                                                                                                            | Fx  | Fe  | M   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --- | --- | --- |
| Sign in                                                               | default                                                                              | load                           | email, password (reveal toggle), "Keep me signed in" (checked in mockup; default unchecked unless backend default), "Forgot password?" | ✔   |     | ✔   |
|                                                                       | **error**                                                                            | wrong credentials              | `role=alert` warn note "That email and password don't match. Check them and try again."                                                | ✔   | ✔   | ✔   |
|                                                                       | throttled                                                                            | too many attempts              | note with retry seconds                                                                                                                | ✔   | ✔   |     |
|                                                                       | submitting                                                                           |                                | button disabled "Signing in…"                                                                                                          | ✔   |     |     |
|                                                                       | passkey ✅ BCR-17                                                                    | click "Sign in with a passkey" | uses the existing `passkey-verify` component; error state if the browser/user cancels                                                  | ✔   |     | ✔   |
| Register                                                              | default / field errors (email taken, weak/short password, mismatch, terms unchecked) | submit                         | hint "At least 12 characters. A short phrase is easiest to remember."; meter; errors inline                                            | ✔   | ✔   | ✔   |
|                                                                       | prefilled from `?tier` / `?next`                                                     |                                | tier carried through                                                                                                                   |     | ✔   |     |
| Verify email 🅱 BCR-23 (unreachable: feature disabled — fixtures only) | waiting                                                                              | after register                 | "We sent a link to {email}"                                                                                                            | ✔   | ✔   | ✔   |
|                                                                       | **resent**                                                                           | click "Send the link again"    | `role=status` ok note "A new link is on its way. Check your spam folder…"; button cooldown                                             | ✔   | ✔   | ✔   |
|                                                                       | log out                                                                              |                                | POST logout                                                                                                                            |     |     | ✔   |
| Two-factor                                                            | **code**                                                                             | challenge                      | 6 OTP boxes, auto-advance/backspace/paste                                                                                              | ✔   |     | ✔   |
|                                                                       | **recovery**                                                                         | "Use a recovery code"          | single field "XXXX-XXXX"                                                                                                               | ✔   |     | ✔   |
|                                                                       | invalid code                                                                         | wrong                          | inline error                                                                                                                           | ✔   | ✔   |     |
| Forgot                                                                | **form**                                                                             | load                           | email                                                                                                                                  | ✔   |     |     |
|                                                                       | **sent**                                                                             | after submit                   | "Check your email … expires in 60 minutes" + "Send again"                                                                              | ✔   | ✔   | ✔   |
| Reset                                                                 | default / invalid token / mismatch / weak                                            |                                | fields: email, new, confirm                                                                                                            | ✔   | ✔   |     |
| Confirm password                                                      | default / wrong password                                                             |                                | passkey alternative ✅ only if the existing wiring supports confirm-by-passkey                                                         | ✔   | ✔   |     |

---

## 3. Client portal (sidebar shell)

### Shell

| State      | Expected UI                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Desktop    | 248px sidebar sticky; active item has bar + card look                                                          |
| < 900px    | Mobile topbar; sidebar off-canvas (280px), scrim, `Esc` + scrim click closes, focus returns to the menu button |
| Nav badges | Documents total, Messages unread (primary pill) — fallback if BCR-12 declined: omit                            |
| Help card  | "Questions about your return?" + Open messages + phone                                                         |

### Overview (`portal-overview.html`)

Three independent axes (30 combinations; test the corners + each value once):

| Axis             | Values                                                                             | Real source                       |
| ---------------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| **Return stage** | 0 Intake received · 1 In preparation · 2 Ready for review · 3 E-signed · 4 E-filed | `status`                          |
| **Fee**          | `quote` (Awaiting quote) · `open` (Due) · `paid`                                   | `invoice.status` + `amount_cents` |
| **Data**         | data · empty (all counts zero)                                                     | counts                            |

Stage → stepper + next-step card (copy per BCR-03 fallback map):

| Stage                                                                                                                                                                                                                                                                                                                                                                       | Dots                              | Next-step card                                                                                                                                      | CTA                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 0                                                                                                                                                                                                                                                                                                                                                                           | 1 now                             | "We have your intake" – A preparer will look over your details within one business day. Upload anything that's missing so we can start sooner.      | Upload documents → documents (secondary)  |
| 1                                                                                                                                                                                                                                                                                                                                                                           | 1 done, 2 now                     | "Your preparer is working on your return" – Nothing for you to do right now. We'll message you here as soon as it's ready to review.                | Open messages (secondary)                 |
| 2                                                                                                                                                                                                                                                                                                                                                                           | 1–2 done, 3 now                   | **Action needed** (accent) "Your return is ready to review" – Look it over, ask anything you're unsure about, then sign Form 8879 so we can e-file. | Review and e-sign → sign (primary, arrow) |
| 3                                                                                                                                                                                                                                                                                                                                                                           | 1–3 done, 4 now                   | "Signed. We're e-filing your return" – We'll confirm here as soon as it's filed. You don't need to do anything else.                                | none                                      |
| 4                                                                                                                                                                                                                                                                                                                                                                           | all done (5th checked, not "now") | "Your return has been e-filed" – Thank you for filing with Okojie. Most IRS refunds arrive within about 21 days of e-filing.                        | View documents (secondary)                |
| Stepper fill width = `idx / 4 × 80%`; horizontal ≥ 640px, vertical < 640px; `aria-current="step"` on the current item; dates: only **E-signed** (`signed_at`) and **E-filed** (`filed_at`) have dates; other stages show only "Now" (BCR-02 fallback). Next-step copy comes from the frontend map `content/next-steps.ts` (BCR-03: `OverviewTest` pins the backend string). |

Fee card:

| Fee state | Chip                     | Body                                                                                                                                                                                                                                  | Action                                                                                                  |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| quote     | Awaiting quote (neutral) | "Not set yet"; "Your preparer sets your fee after reviewing your documents. {Tier} returns usually cost {range}."; rows: You pay → Before we e-file; Payment → Card, online; hint "You'll always see the exact price before we file." | none                                                                                                    |
| open      | Due (warning, dot)       | `$amount`; "{Tier} · {year} federal + state return"; rows Preparation / Due; **Pay $amount** (primary, card icon); "Secure checkout"                                                                                                  | POST checkout                                                                                           |
| paid      | Paid (success, dot)      | `$amount`; "Paid {date}"(+ card last4 if BCR-04); rows Preparation / Status Paid in full                                                                                                                                              | **View receipt** → existing `portal.invoices.receipt` route (✅); no card brand/last4 (BCR-04 fallback) |

Other cards: Metrics (data vs empty "No data yet" with "—"), Recent documents (scan chips Clean / Pending scan; empty "No documents yet" + Upload documents), Upcoming call (Confirmed chip, calendar tile, Join call / Reschedule; empty "No calls booked"). Head chip shows tier (or hides if none) + "{year} federal + {state} return". **Interim fallbacks (replaced by real data after BE-01/BE-06):** Messages and Next-call tiles are plain links without numbers; Recent documents is replaced by a "View documents" link; Upcoming call always shows "No calls booked". Fx for each axis value + empty; Fe = OverviewTest/PaymentTest; M for stage 3 → sign link and fee open → pay.

### Documents (`portal-documents.html`)

| State                       | Reached by                       | Expected UI                                                                                                                                                                                          |
| --------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty                       | no documents                     | checklist (no "uploaded" counts), "No documents yet — Upload your first file and it will appear here once it's been scanned." + Upload button                                                        |
| Data                        | documents exist                  | rows with file badge (extension), name, size · date, type chip, **status**: Clean (ok) · Pending scan / Scanning… (wait) · Blocked (bad), actions: download (disabled when blocked/pending) + delete |
| Checklist                   | data                             | per category "1 uploaded" / "Optional" derived from document types                                                                                                                                   |
| **Open (can delete)**       | return status < Ready for review | delete buttons visible                                                                                                                                                                               |
| **Locked**                  | status ≥ Ready for review        | warn lock bar "Your return is ready for review, so documents can't be deleted now. Message your preparer if something needs to change."; delete hidden                                               |
| File picked                 | choose / drop file               | drop zone replaced by selected-file row with remove; submit "Upload document"                                                                                                                        |
| Drag-over                   | drag                             | dropzone highlight                                                                                                                                                                                   |
| Uploading / error / success | submit                           | progress bar; field error (type/size/MIME); toast "Document uploaded. We're scanning it now."                                                                                                        |
| Size copy                   |                                  | show the real backend max (D-04)                                                                                                                                                                     |

### Appointments (`portal-appointments.html`)

Empty ("No appointments yet" + Choose a date) · data grouped **Upcoming** / **Past** · statuses: Confirmed (success dot, Join call* / Reschedule*), Requested (warning dot, "Cancel request"), Completed (neutral), Cancelled (neutral) · form defaults per D-03 (format **Video**, window **Afternoon**, date empty — never the mockup's 2027 sample date) · submit success toast "Request sent. We'll confirm a time within one business day." · validation (date today..+180d). *BCR-07 fallback.

### Messages (`portal-messages.html`)

Empty · data (grouped by day: Today / date) · unread message styling (+ "New" chip, "1 unread" hint) · attachments* · "Mark all as read" (head action, only when unread; uses the existing bulk route `portal.messages.read` ✅) · reply note with phone + "book a call" · side cards: preparer*, Staying safe. *BCR-06 fallback.

### Referrals (`portal-referrals.html`)

Hero with link (`…/r/{code}`, D-07) + Copy (toast "Referral link copied"; button label "Copied") · three-step explainer · invite form (errors: invalid email, self-referral, duplicate) · empty ("No referrals yet" + Copy my link) · table rows: Invite sent (wait), Signed up (info), Filed (ok), Rewarded (ok) · "$X earned so far"* · reward cell: amount / "When they file" / "—".

### Security & 2FA (`portal-security.html`)

| State                   | Reached by                   | Expected UI                                                                                                                                            |
| ----------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Off (required gate)** | client without confirmed 2FA | accent `role=alert` gate note "Turn on two-factor authentication to continue…"; chip "Required"; apps list; primary "Set up two-factor authentication" |
| **Setup**               | click setup                  | chip "Step 2 of 2"; QR (Fortify `qr_code` SVG), manual key, OTP boxes, "Turn on 2FA" / Cancel; confirm requires password confirm flow                  |
| **On**                  | confirmed                    | chip "On"; recovery codes (copy, "Create new codes"); danger "Turn off two-factor authentication" + hint (clients are asked to set up again)           |
| Password form           | always                       | current/new/confirm, strength meter (4 segments + "Strong · N characters"), "Changed … ago"* (BCR-09), success toast "Password updated", errors        |

### Review & e-sign (`portal-sign.html`)

| State                                                                                     | Expected UI                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Not signed                                                                                | summary shell (result tiles*, key/value rows*, forms list*), Form 8879 declaration text, **Form 7216 consent** checkbox (label text from mockup), "Type your full legal name to sign", audit hint "We record the time, IP address and browser with your signature.", button **disabled** until consent checked **and** name > 3 chars |
| Submitting / error                                                                        | spinner; server error note                                                                                                                                                                                                                                                                                                            |
| **Signed**                                                                                | form hidden; done card "Signed. We're e-filing your return." with Back to overview / View documents; page head eyebrow "Step 3 of 5 · Ready for review" hidden or updated                                                                                                                                                             |
| Not eligible                                                                              | return not at Ready for review → redirect to overview (existing behavior)                                                                                                                                                                                                                                                             |
| Side cards: "After you sign" timeline, "Something look wrong?" + phone. *BCR-05 fallback. |

### Receipt (`portal-receipt.html`) ✅ page exists (`portal/receipt.tsx`, route `portal.invoices.receipt`)

Paper card with brand header, **payment reference** (shortened `stripeSessionId`, D-13) instead of a receipt number, date (`paidAt`), Paid banner + amount, Billed to (`clientName`/`clientEmail`), line "Tax preparation — {taxYear} return", single-line totals, footer phone/email, **Print** (window.print + `print:` variants). **No** Download PDF, card brand/last4 (BCR-04 fallback). 404 unless paid (existing behavior).
---

## 4. Staff admin & settings

### Clients (`admin-clients.html`)

**Server-paginated (25/page) with server-side `?search=` ✅.** States: data vs empty ("No clients yet" + Review leads) · empty search result ("No clients match …") · rows: avatar+name+email, tier chip, status (Intake received wait · In preparation info · Ready for review warn · E-signed info · E-filed ok), preparer (avatar+name or "Unassigned"), invoice amount + (Awaiting quote / Open / Paid) · pager from paginator links ("Showing {from}–{to} of {total}", Previous disabled on first page). **Hidden (BCR-13 fallback):** season metrics, status/tier filters, Assigned-to-me/All tabs, Export, Invite a client.

### Client detail (`admin-client.html`)

| Element      | States                                                                                                                                                                                                                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stage card   | chip per stage; stage rail (done/now/todo); **actions depend on stage**: Intake → "Mark as in preparation"; Prep → "Mark as ready for review"; Ready → "Mark as e-signed" (confirm dialog); E-signed → "Mark as e-filed"; E-filed → none; "Move back" disabled at stage 0 (reason dialog, required) |
| Documents    | data table (scan chips incl. **Infected** → download disabled) · empty                                                                                                                                                                                                                              |
| Messages     | thread bubbles (staff, "Unread" flag) · empty · composer "Post" (toast "Message posted to the client's portal")                                                                                                                                                                                     |
| Invoice      | chip (Awaiting quote / Open / Paid); set amount form; "Mark paid offline" (confirm dialog) hidden when paid                                                                                                                                                                                         |
| Appointments | requested → Confirm / Cancel; confirmed chip; empty                                                                                                                                                                                                                                                 |
| History      | timeline with reasons                                                                                                                                                                                                                                                                               |
| Referral     | code, referred by, friends referred                                                                                                                                                                                                                                                                 |
| Dialogs      | advance, reverse (reason), paid — focus trap, Esc, return focus                                                                                                                                                                                                                                     |

### Leads (`admin-leads.html`)

Server-paginated (25/page) with **server filters `?status=` and `?kind=` ✅**. Tabs = `statuses` + All as links (no counts); Kind filter menu; rows (quote vs consultation icon, contact, details chips/notes, `refCode`, formatted timestamp, status chip, **internal notes editable via `leads.notes` ✅**, actions **Contacted** (`leads.status` ✅) and **Convert** (`leads.convert` ✅)). **Convert dialog states real behavior (D-12):** creates the client account and a {year} return; no email is sent; no preparer select. Empty "No new leads" + Show all leads. Hidden: search, counts, Export (BCR-14).

### Referrals (`admin-referrals.html`)

Server-paginated (30/page). Rows: referrer → friend ("Account created" if `hasSignedUp`, else "Invite only"), status (Filed ok, Signed up info, Sent wait, Rewarded ok), reward (`formattedReward`), sent date, **Mark rewarded** only when `canReward` → dialog "Mark as rewarded?" → `referrals.reward` ✅. Empty "No referrals recorded yet". Hidden: totals strip and Ready-to-reward tab (BCR-15).

### Settings

| Page       | States                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Profile    | saved toast "Profile saved"; field errors; email-change hint; delete account → confirm dialog (danger); avatar/title/office* (BCR-11)                                                       |
| Security   | password update (reveal + meter); 2FA summary + recovery codes (existing components); **passkeys list/add/remove ✅ (existing components)**; devices ✗ (BCR-10)                             |
| Appearance | theme radio: Light / Dark / Match my system (applies instantly, persisted); Compact tables switch; Reduce motion switch (both saved on the user's account, D-10 → BE-17; theme stays local) |

---

## 5. Cross-cutting checks for every page

- Light + dark, 1440 / 1024 / 768 / 390 px screenshots, no horizontal scroll.
- Keyboard: tab order, visible focus, dialogs trap + restore focus, Esc closes, sidebar drawer.
- Axe: zero serious/critical.
- `prefers-reduced-motion` and in-app Reduce motion honored.
- No console errors/warnings; no hydration mismatch (SSR pages).
- No sample data leaking into production UI.
