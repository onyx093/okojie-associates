# Okojie Online — Reproduction Package

A complete set of documents for giving to an LLM (or a developer) so it can rebuild the **Okojie & Associates, Inc. / Okojie Online** website: a marketing site for a Philadelphia/Baltimore tax-preparation firm plus a secure client portal.

**Target stack:** Laravel 13 · Inertia v3 · React 19 (TypeScript) · Tailwind CSS v4 · shadcn/ui (plus Fortify, Wayfinder, Cashier, Pest — see `SPEC.md` §1).

Source: 13 screenshots of the live site (public pages, auth screens, and all five portal tabs). The site's HTML could not be fetched directly because it is client-rendered, so everything here comes from what is visible in those screenshots.

## Files

| File               | Purpose                                                                                                        | Give to the LLM when…                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `PRD.md`           | Product goals, users, scope, success metrics                                                                   | You want it to understand _why_              |
| `FEATURES.md`      | Numbered feature inventory with acceptance criteria                                                            | You want a checklist to build/verify against |
| `SPEC.md`          | Laravel/Inertia architecture, routes, Eloquent data model, Form Requests, policies, security, testing          | You want it to understand _how_              |
| `DESIGN_SYSTEM.md` | Colors, type, spacing, Tailwind v4 `@theme` + shadcn/ui variable mapping, components, motion, responsive rules | Building UI                                  |
| `CONTENT.md`       | Every piece of copy, office data, pricing, FAQs, testimonials                                                  | Filling in pages (exact text)                |
| `PROMPTS.md`       | Master prompt + 12 ordered build prompts (Laravel/Inertia/React/shadcn) + QA, rebrand, compliance prompts      | Running the build                            |

## Recommended workflow

1. Start a fresh LLM coding session (Claude Code, Cursor, etc.) with PHP 8.3+, Composer, and Node 20+/22 LTS installed.
2. Attach/paste `PRD.md`, `SPEC.md`, `FEATURES.md`, `DESIGN_SYSTEM.md`, `CONTENT.md`.
3. Paste **Prompt 0 (Master)** from `PROMPTS.md`.
4. Run Prompts 1 → 12 in order, one per turn, verifying each before moving on.
5. Run the QA prompt (Prompt 13) and fix gaps.

## Confidence legend (used throughout)

- **[OBSERVED]** — directly visible in a screenshot.
- **[INFERRED]** — not visible, but required for the visible UI to work or strongly implied. Treat as a reasonable default.
- **[CLAIMED]** — the site states it (e.g. MFA, WISP compliance) but the screenshots don't show the mechanism.
- **[DRAFTED]** — I wrote it because the original wasn't visible (e.g. FAQ answers, hidden step names).

## Known gaps in the source material

- **FAQ answers**: only the 8 questions were visible, collapsed. Answers in `CONTENT.md` are drafted.
- **Homepage**: screenshot is small and several sections were mid scroll-reveal animation (faded). Steps 3–5 of "How it works", the third testimonial's detail, the Premium card on the homepage, and the 3rd/4th office cards were faded or cut off; they are completed from other pages and marked.
- **Staff/admin side**: not shown. Needed for the portal to function, so specified as **[INFERRED]** in `SPEC.md`.
- **MFA, e-sign (Form 8879), payment**: claimed/visible as buttons or copy, but flows were not shown.
- **Exact colors/fonts**: estimated from screenshots. Sample with an eyedropper against the live site for pixel accuracy.
- **Original typo**: footer reads "Okojie & Associates, Inc.. All rights reserved." (double period). Don't replicate.

## Branding and legal note

"Okojie & Associates" is a real firm name, and a USPTO record exists for an owner of the same surname in tax-preparation services. If you are building your own product, do **not** reuse the firm's name, logo, photography, testimonials, office addresses, or phone numbers. All brand values live in one config object (see `SPEC.md` §3 and Prompt 14), so swapping them is a one-file change. The phone numbers shown on the original are 555 fictional numbers; the testimonials and stats appear to be demo content.

Also: tax software handles highly sensitive data (SSNs, income). Before taking real client data you need a proper security review, an IRS-compliant WISP, and a legal review of the e-signature and e-file flows. These docs describe the UI and product shape, not a compliance certification.

## Testing Stripe Payments with Stripe CLI

To test Stripe Checkout payments and webhooks locally during development:

1. **Install and authenticate the Stripe CLI:**

    ```bash
    stripe login
    ```

2. **Forward webhook events to your local application:**

    ```bash
    stripe listen --forward-to localhost/stripe/webhook
    ```

    Copy the temporary signing secret output by the CLI (`whsec_...`) into your `.env` file as `STRIPE_WEBHOOK_SECRET`.

3. **Complete checkout in Stripe test mode:**
    - In the client portal Overview tab, click **Pay Now** on an invoice with an active quote.
    - You will be redirected to the Stripe Checkout page. Use any Stripe test card (e.g. `4242 4242 4242 4242`, any future expiration date, and CVC `123`).
    - Upon successful payment, Stripe redirects back to `/portal/overview?payment=success`.
    - The `checkout.session.completed` webhook fires, which marks the invoice as **Paid** idempotently, queues a `PaymentReceipt` confirmation email to the client, and records an `AuditLog` entry.
