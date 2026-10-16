# Architecture and Product Decisions

This document records architectural, functional, and product decisions made during implementation where source documents contained ambiguities or called for sensible defaults.

## DEC-001: Staff and Admin Workflows (`/admin/*`)
- **Context**: PRD §4 and SPEC §2 specify staff and admin management for leads, clients, returns, messages, appointments, and invoicing as `[INFERRED]`. No source screenshots exist for the admin interface.
- **Decision**: Implement `/admin/*` routes within the dark theme design system (`/admin/leads`, `/admin/clients`, `/admin/clients/{client}`) protected by the `can:access-admin` Gate. Staff can view leads, update return statuses, post preparer messages, confirm appointments, and set invoice amounts.

## DEC-002: Invoice Initial Amount & State
- **Context**: The Overview screenshot shows `$225` with "No tier selected", but PRD §9 notes the invoice amount should be set by the preparer after quote review.
- **Decision**: Newly created `TaxReturn` records default to `Invoice.amount_cents = null` (rendering "Pending quote" with a disabled "Pay Now" button in the client portal). For testing and demo parity matching the screenshot, `DemoClientSeeder` populates `client@example.com` with a return invoice of `$225` (22500 cents).

## DEC-003: Multi-Factor Authentication (MFA) Enforcement Flow
- **Context**: "Every client account is protected with MFA" is claimed, but the registration screen only asks for email and password.
- **Decision**: Fortify 2FA (TOTP + recovery codes) is enabled. Staff accounts require 2FA immediately. Client accounts are granted a grace period until they visit `/portal`, where the `EnsureTwoFactorEnabled` middleware redirects unconfirmed users to `/portal/security` with an alert to activate MFA. Returning users with 2FA confirmed are challenged at `/two-factor-challenge` using the shadcn `input-otp` component.

## DEC-004: Client Messaging Interface
- **Context**: The observed screenshot shows "Messages from your preparer" with no client reply input, though PRD §9 discusses two-way communication.
- **Decision**: In v1, adhere strictly to the observed UI: messages are read-only for clients, displaying messages posted by staff/preparers with unread indicators and a "Mark as read" interaction. The `messages` schema retains `to_user_id` and `from_user_id` to seamlessly support client replies in v1.1.

## DEC-005: E-Signature Flow (Form 8879 / Form 7216)
- **Context**: Form 8879 e-signature and Form 7216 disclosure consent are required when the return status reaches "Ready for review", but no UI screens exist in the source package.
- **Decision**: Build `/portal/sign/{taxReturn}` with a return summary, mandatory Form 7216 disclosure consent checkbox, typed signature input, IP/user-agent/timestamp audit logging, and automated advancement of the return status to `ESigned`.

## DEC-006: Local File Antivirus Scanning
- **Context**: ClamAV integration is required for file uploads, but local development and CI containers may lack a running `clamd` socket/daemon.
- **Decision**: Implement the `ScanDocument` queued job to check for an active ClamAV connection (`CLAMAV_HOST`). If unconfigured or in testing/local environments without `CLAMAV_HOST`, the scan job logs a warning and marks files as `clean`. In production, it enforces active virus scanning before files can be downloaded.

## DEC-007: Referral Reward Tier Calculation
- **Context**: The marketing copy mentions "$25–$50" rewards without explicit tier-to-dollar mappings.
- **Decision**: Follow SPEC §3: when a referred user files under *Upload & Go*, the referrer earns $25 (2500 cents). When a referred user files under *Hybrid* or *Premium Remote*, the referrer earns $50 (5000 cents). Rewards are logged when the return reaches `EFiled`.

## DEC-008: Video Library Placeholders
- **Context**: Six video cards are specified with sample copy in `CONTENT.md` without actual video assets.
- **Decision**: Cards render thumbnail previews with play buttons. Clicking a video opens a shadcn Dialog modal containing an HTML5 video player if a URL is provided in `config/videos.php`, or a clean informational message ("Video walkthrough coming soon for tax season") when no URL is present.
