# Backend Contracts (`docs/ui-migration/BACKEND-CONTRACTS.md`)

Authoritative Inertia prop shapes, route names, and request/response contracts produced by `BE-01` … `BE-17`.

---

## BE-01 — Client Portal Overview (`portal/overview`)

- **Route:** `GET /portal/overview` (`portal.overview`)
- **Controller:** `App\Http\Controllers\Portal\OverviewController@index`
- **Inertia Component:** `'portal/overview'`

### Props Shape

```ts
type NextStep = {
    key:
        | 'intake_received'
        | 'in_preparation'
        | 'ready_for_review'
        | 'e_signed'
        | 'e_filed';
    title: string;
    text: string;
    cta: {
        label: string;
        target: 'documents' | 'messages' | 'sign';
    } | null;
    tone: 'default' | 'action' | 'done';
};

type TaxReturnResource = {
    id: string;
    tax_year: number;
    status:
        | 'intake_received'
        | 'in_preparation'
        | 'ready_for_review'
        | 'e_signed'
        | 'e_filed';
    status_label: string;
    next_step_text: string; // matches next_step.text
    next_step: NextStep;
    tier: 'upload_and_go' | 'hybrid' | 'premium_remote' | null;
    signed_at: string | null; // ISO-8601
    filed_at: string | null; // ISO-8601
};

type StageDates = {
    intake_received: string | null; // TaxReturn.created_at (ISO-8601)
    in_preparation: string | null; // First StatusEvent with to = in_preparation (ISO-8601)
    ready_for_review: string | null; // First StatusEvent with to = ready_for_review (ISO-8601)
    e_signed: string | null; // First StatusEvent with to = e_signed (ISO-8601)
    e_filed: string | null; // First StatusEvent with to = e_filed (ISO-8601)
};

type OverviewPageProps = {
    taxReturn: TaxReturnResource | null;
    invoice: InvoiceResource | null;
    counts: {
        documents: number;
        referrals: number;
    };
    unreadMessages: number;
    nextAppointment: AppointmentResource | null; // earliest Requested/Confirmed with preferred_date >= today
    recentDocuments: DocumentResource[]; // latest 3 documents
    stageDates: StageDates;
};
```

---

## BE-02 — Appointments Scheduled Time & Join URL (`appointments` / `AppointmentResource`)

- **Portal Route:** `GET /portal/appointments` (`portal.appointments`)
- **Admin Action Route:** `PATCH /admin/appointments/{appointment}/status` (`admin.appointments.status`)
- **Form Request:** `App\Http\Requests\Admin\UpdateAppointmentStatusRequest`
- **Resource:** `App\Http\Resources\AppointmentResource`

### Request Contract (`PATCH /admin/appointments/{appointment}/status`)

```ts
type UpdateAppointmentStatusPayload = {
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
    scheduled_at?: string | null; // Optional date/ISO string; must be > now when status === 'confirmed'
    join_url?: string | null; // Optional https:// URL, max 2048 chars
};
```

### Resource Shape (`AppointmentResource`)

```ts
type AppointmentResource = {
    id: string;
    preferred_date: string; // YYYY-MM-DD
    preferred_date_formatted: string; // e.g. "Feb 18, 2026"
    preferred_date_full: string; // e.g. "Wednesday, February 18, 2026"
    time_window: 'morning' | 'afternoon' | 'evening' | 'anytime';
    time_window_label: string;
    format: 'video' | 'phone' | 'in_person';
    format_label: string;
    topic: string | null;
    notes: string | null;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
    status_label: string;
    confirmed_at: string | null; // ISO-8601
    scheduled_at: string | null; // ISO-8601
    scheduled_at_formatted: string | null; // e.g. "Wed, Feb 18 · 4:30 PM" (app timezone)
    join_url: string | null; // Non-null ONLY when status === 'confirmed' && format === 'video'
    created_at: string | null; // ISO-8601
    created_at_formatted: string | null;
    can_cancel: boolean;
};
```

---

## BE-03 — User Profile Fields, Avatar, Office Slugs & `password_changed_at`

- **Profile Routes:**
    - `GET /settings/profile` (`profile.edit`)
    - `PATCH /settings/profile` (`profile.update`)
    - `POST /settings/profile/avatar` (`profile.avatar.store`)
    - `DELETE /settings/profile/avatar` (`profile.avatar.destroy`)
- **Security Pages:**
    - `GET /settings/security` (`security.edit`)
    - `GET /portal/security` (`portal.security`)

### Shared `auth.user` Contract (`HandleInertiaRequests`)

```ts
type AuthUser = {
    id: number;
    name: string | null;
    email: string;
    role: 'client' | 'preparer' | 'admin';
    tier: 'upload_and_go' | 'hybrid' | 'premium_remote' | null;
    tierLabel: string | null;
    twoFactorEnabled: boolean;
    title: string | null;
    office:
        | 'germantown-ave'
        | 'n-broad-st'
        | 'w-chelten-ave'
        | 'liberty-heights-baltimore'
        | null;
    officeLabel: string | null; // e.g. "5601 Germantown Ave, Philadelphia"
    avatarUrl: string | null; // Full public disk URL or null
};
```

### `settings/profile` Props & Requests

```ts
type OfficeOption = {
    slug:
        | 'germantown-ave'
        | 'n-broad-st'
        | 'w-chelten-ave'
        | 'liberty-heights-baltimore';
    label: string;
};

type SettingsProfileProps = {
    mustVerifyEmail: boolean;
    status?: string | null;
    offices: OfficeOption[];
};

type ProfileUpdatePayload = {
    name: string;
    email: string;
    title?: string | null; // max 120
    office?: string | null; // must be in config('site.offices.*.slug')
};

type AvatarUploadPayload = {
    avatar: File; // image: jpg, jpeg, png, webp, max 2048 KB (2 MB)
};
```

### `settings/security` & `portal/security` Props Additions

```ts
type SecurityPasswordTimestampProps = {
    passwordChangedAt: string | null; // ISO-8601
};
```

---

## BE-04 — Settings Security Active Sessions (`settings/security`)

- **Page Route:** `GET /settings/security` (`security.edit`, middleware `RequirePassword`)
- **Destroy Route:** `DELETE /settings/security/sessions` (`settings.security.sessions.destroy`, middleware `RequirePassword`)
- **Controller:** `App\Http\Controllers\Settings\SecurityController`
- **Helper:** `App\Support\UserAgentParser`

### `settings/security` Props & Request Contract

```ts
type SessionDevice = {
    id: string;
    ip: string | null;
    device: string; // e.g. "Chrome on macOS", "Safari on iPhone", "Edge on Windows"
    lastActiveAt: string; // ISO-8601
    lastActiveHuman: string; // e.g. "2 hours ago"
    isCurrent: boolean;
};

type SettingsSecurityProps = {
    canManageTwoFactor: boolean;
    canManagePasskeys: boolean;
    passkeys: Array<{
        id: number;
        name: string;
        authenticator: string | null;
        created_at_diff: string;
        last_used_at_diff: string | null;
    }>;
    passwordRules: string;
    passwordChangedAt: string | null; // ISO-8601
    sessions: SessionDevice[];
    twoFactorEnabled?: boolean;
    requiresConfirmation?: boolean;
};

type DestroyOtherSessionsPayload = {
    current_password: string; // required, current_password rule
};
```

---

## BE-05 — Portal Messages `preparer` Prop & Message Attachments

- **Portal Messages Route:** `GET /portal/messages` (`portal.messages`)
- **Portal Attachment Download Route:** `GET /portal/messages/attachments/{attachment}/download` (`portal.messages.attachments.download`)
- **Admin Store Message Route:** `POST /admin/clients/{client}/messages` (`admin.clients.messages.store`)
- **Admin Attachment Download Route:** `GET /admin/messages/attachments/{attachment}/download` (`admin.messages.attachments.download`)

### `portal/messages` Props Shape

```ts
type AssignedPreparer = {
    name: string | null;
    title: string | null;
    office: string | null;
    officeLabel: string | null;
    avatarUrl: string | null;
};

type MessageAttachmentItem = {
    id: string;
    filename: string;
    size_formatted: string; // e.g. "214 KB", "1.2 MB"
    download_url: string;
};

type PortalMessageItem = {
    id: string;
    fromUserId: number;
    toUserId: number;
    fromName: string;
    isFromStaff: boolean;
    body: string;
    readAt: string | null;
    isUnread: boolean;
    createdAt: string | null;
    formattedDate: string;
    attachments: MessageAttachmentItem[];
};

type PortalMessagesPageProps = {
    preparer: AssignedPreparer | null;
    messages: PortalMessageItem[];
};
```

### Admin Message Store Payload (`POST /admin/clients/{client}/messages`)

```ts
type AdminStoreMessagePayload = {
    body: string; // required, max 5000
    attachments?: File[]; // optional, max 3 files, each <= 25 MB, SafeUpload rules
};
```

---

## BE-06 — Invoice Receipt Numbers, Payment Method Card Brand/Last4 & Receipt Props

- **Receipt Route:** `GET /portal/invoices/{invoice}/receipt` (`portal.invoices.receipt`)
- **Resource:** `App\Http\Resources\InvoiceResource`

### `InvoiceResource` Shape

```ts
type PaymentMethodSummary = {
    brand: string; // e.g. "Visa"
    last4: string; // e.g. "4242"
};

type InvoiceResource = {
    id: string;
    amount_cents: number | null;
    amount_formatted: string | null; // e.g. "$225"
    currency: string;
    status: 'draft' | 'open' | 'paid' | 'void';
    paid_at: string | null; // ISO-8601
    receipt_number: string | null; // e.g. "RCPT-2026-00001"
    payment_method: PaymentMethodSummary | null;
};
```

### `portal/receipt` Props Shape

```ts
type PortalReceiptPageProps = {
    receiptNumber: string; // e.g. "RCPT-2026-00001"
    paymentMethod: PaymentMethodSummary | null;
    lineItem: string; // e.g. "Tax preparation — 2026 return"
    invoice: {
        id: string;
        amountCents: number | null;
        amountFormatted: string; // e.g. "$225.00"
        paidAt: string;
        taxYear: number;
        clientName: string;
        clientEmail: string;
        stripeSessionId: string | null;
        receiptNumber: string;
        paymentMethod: PaymentMethodSummary | null;
        lineItem: string;
    };
};
```

---

## BE-07 — Prepared Return Summary (`tax_returns.return_summary`, Admin Editor & Portal Sign Props)

- **Admin Update Route:** `PATCH /admin/tax-returns/{taxReturn}/summary` (`admin.returns.summary`)
- **Admin Client Detail Route:** `GET /admin/clients/{client}` (`admin.clients.show`)
- **Portal Sign Route:** `GET /portal/sign/{taxReturn}` (`portal.sign`)

### Raw `returnSummary` Shape (stored on `tax_returns.return_summary` & passed to `admin/client-show`)

```ts
type ReturnSummaryResult = 'refund' | 'owed' | 'even';
type ReturnSummaryStateCode = 'PA' | 'MD' | 'NJ' | 'DE';
type FilingStatus =
    | 'single'
    | 'married_joint'
    | 'married_separate'
    | 'head_of_household'
    | 'qualifying_surviving_spouse';
type FilingMethod = 'e-file';

type RawReturnSummary = {
    federal: {
        result: ReturnSummaryResult;
        amount_cents: number;
    };
    state: {
        code: ReturnSummaryStateCode;
        result: ReturnSummaryResult;
        amount_cents: number;
    } | null;
    bank_last4: string | null; // strictly 4 digits or null
    filing_status: FilingStatus;
    filing_method: FilingMethod;
    forms: Array<{
        name: string;
        pages: number; // >= 1
        document_id: string | null; // must belong to the client's documents
    }>; // max 12 items
};

type SummaryOptionLists = {
    results: Array<{ value: ReturnSummaryResult; label: string }>;
    states: Array<{ value: ReturnSummaryStateCode; label: string }>;
    filingStatuses: Array<{ value: FilingStatus; label: string }>;
    filingMethods: Array<{ value: FilingMethod; label: string }>;
};
```

### Formatted `returnSummary` Prop on `portal/sign` (`null` when absent)

```ts
type FormattedReturnSummary = {
    federal: {
        result: ReturnSummaryResult;
        result_label: string;
        amount_cents: number;
        amount_formatted: string; // e.g. "$2,418"
    };
    state: {
        code: ReturnSummaryStateCode;
        name: string; // e.g. "Pennsylvania"
        result: ReturnSummaryResult;
        result_label: string;
        amount_cents: number;
        amount_formatted: string; // e.g. "$0"
    } | null;
    bank_last4: string | null;
    filing_status: FilingStatus;
    filing_status_label: string; // e.g. "Head of household"
    filing_method: FilingMethod;
    filing_method_label: string; // "IRS e-file"
    forms: Array<{
        name: string;
        pages: number;
        document_id: string | null;
        open_url: string | null; // route('portal.documents.download', id) only for the client's own documents
    }>;
};
```

---

## BE-08 — Shared Lazy `navCounts` Prop (`HandleInertiaRequests`)

- **Shared Middleware:** `App\Http\Middleware\HandleInertiaRequests`

### `navCounts` Shared Prop Shape

```ts
type ClientNavCounts = {
    documents: number;
    unreadMessages: number;
};

type StaffNavCounts = {
    clients: number; // assigned clients for preparers; all clients for admins
    newLeads: number; // leads with status === 'new'
};

type NavCountsSharedProp = ClientNavCounts | StaffNavCounts | null; // null for guests
```

---

## BE-09 — Admin Clients Filters, Metrics, CSV Export & Client Invitation

- **Index Route:** `GET /admin/clients` (`admin.clients.index`)
- **CSV Export Route:** `GET /admin/clients/export` (`admin.clients.export`)
- **Invite Route:** `POST /admin/clients/invite` (`admin.clients.invite`)

### `admin/clients` Props Shape

```ts
type AdminClientsFilters = {
    search: string;
    status: string; // ReturnStatus value or ""
    tier: string; // Tier value or ""
    scope: 'mine' | 'all'; // default 'mine' for preparers, 'all' for admins
};

type AdminClientsScopeCounts = {
    mine: number;
    all: number;
};

type AdminClientsMetrics = {
    inPreparation: {
        count: number;
        deltaWeek: number; // this week vs previous 7 days
    };
    waitingSignature: {
        count: number;
        oldestDays: number;
    };
    unpaid: {
        amountCents: number;
        amountFormatted: string; // e.g. "$3,480"
        count: number;
    };
    eFiled: {
        count: number;
        deltaWeek: number;
    };
};

type AdminClientsPageProps = {
    clients: Paginated<AdminClientRow>;
    filters: AdminClientsFilters;
    scopeCounts: AdminClientsScopeCounts;
    statuses: Array<{ value: string; label: string }>;
    tiers: Array<{ value: string; label: string }>;
    metrics: AdminClientsMetrics;
    isPreparer: boolean;
};
```

### `POST /admin/clients/invite` Payload

```ts
type InviteClientPayload = {
    name: string;
    email: string; // unique across users
    tier?: 'upload_and_go' | 'hybrid' | 'premium_remote' | null;
    preparer_id?: number | null;
};
```

---

## BE-10 — Admin Leads Counts, Search, CSV Export & Convert with Invitation

- **Index Route:** `GET /admin/leads` (`admin.leads.index`)
- **CSV Export Route:** `GET /admin/leads/export` (`admin.leads.export`)
- **Convert Route:** `POST /admin/leads/{lead}/convert` (`admin.leads.convert`)

### `admin/leads` Props Shape

```ts
type AdminLeadsCounts = {
    new: number;
    contacted: number;
    converted: number;
    closed: number;
    all: number;
};

type AdminLeadsFilters = {
    kind: string;
    status: string;
    search: string;
};

type AdminLeadsPageProps = {
    leads: Paginated<AdminLeadRow>;
    filters: AdminLeadsFilters;
    counts: AdminLeadsCounts;
    preparers: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
    kinds: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
};
```

### `POST /admin/leads/{lead}/convert` Payload

```ts
type ConvertLeadPayload = {
    preparer_id?: number | null; // optional; preparers default to themselves
};
```

---

## BE-11 — Admin Referrals Totals & Status Filter (`ready` | `all` | `ReferralStatus`)

- **Index Route:** `GET /admin/referrals` (`admin.referrals.index`)
- **Reward Route:** `POST /admin/referrals/{referral}/reward` (`admin.referrals.reward`)

### `admin/referrals` Props Shape

```ts
type AdminReferralsTotals = {
    invites: number;
    signedUp: number;
    signedUpPercent: number; // 0..100 integer
    filed: number; // filed + rewarded
    readyToReward: number; // status === 'filed'
    rewardsPaidCents: number;
    rewardsPaidFormatted: string; // e.g. "$640"
    rewardedClients: number;
};

type AdminReferralsPageProps = {
    referrals: Paginated<AdminReferralRow>;
    filters: {
        status: 'ready' | 'all' | 'sent' | 'signed_up' | 'filed' | 'rewarded';
    };
    counts: {
        ready: number;
        all: number;
    };
    totals: AdminReferralsTotals;
};
```

---

## BE-12 — Email Verification (`MustVerifyEmail` & `auth/verify-email`)

- **Notice Route:** `GET /email/verify` (`verification.notice`)
- **Verify Route:** `GET /email/verify/{id}/{hash}` (`verification.verify`)
- **Resend Route:** `POST /email/verification-notification` (`verification.send`)

### `auth/verify-email` Props Shape

```ts
type VerifyEmailPageProps = {
    status?: string | null; // e.g. 'verification-link-sent'
};
```

---

## BE-13 — Shared Lazy `honeypot` Prop (`HandleInertiaRequests`)

- **Shared Middleware:** `App\Http\Middleware\HandleInertiaRequests`

### `honeypot` Shared Prop Shape

```ts
type HoneypotSharedProp = {
    name: string; // config('honeypot.name_field_name'), default 'my_name'
    validFromName: string; // config('honeypot.valid_from_field_name'), default 'valid_from'
    validFrom: string; // Spatie Honeypot encrypted timestamp token
} | null; // null when config('honeypot.enabled') is false
```

---

## BE-14 — Dead Starter Pages & `dashboard` Route Removal

- Removed route `GET /dashboard` (`dashboard`) from `routes/web.php`.
- Deleted unused Inertia pages:
    - `resources/js/pages/dashboard.tsx`
    - `resources/js/pages/welcome.tsx`
    - `resources/js/pages/auth/login.tsx`
    - `resources/js/pages/auth/register.tsx`
- Updated starter shell components (`app-header.tsx`, `app-sidebar.tsx`, `passkey-verify.tsx`) to use `overview` from `@/routes/portal` instead of `dashboard`.

---

## BE-15 — About Page `stats` Fourth Stat (`12 Credentialed preparers`)

### Route & Controller

- **Route**: `GET /about` (`about`)
- **Controller**: `App\Http\Controllers\AboutController`

### Props (`about`)

- `stats`: `list<array{value: string, label: string}>` built from `config('site.stats')`:
    1. `['value' => '26+', 'label' => 'Years serving PA & MD taxpayers']`
    2. `['value' => '40,000+', 'label' => 'Returns prepared and filed']`
    3. `['value' => '12', 'label' => 'Credentialed preparers']`
    4. `['value' => '4', 'label' => 'Offices across Philadelphia & Baltimore']`
- `offices`: `config('site.offices', [])` (unchanged)

---

## BE-16 — Short Referral Redirect (`GET /r/{code}`) & `referralLink`

### Public Redirect Route

- **Route**: `GET /r/{code}` (`referral.redirect`)
- **Controller**: `App\Http\Controllers\ReferralRedirectController` (invokable)
- **Middleware**: `web`, `throttle:60,1`
- **Behavior**:
    - Validates `$code` against `/^[A-Za-z0-9-]{3,30}$/`.
    - Valid shape (whether or not the code exists in the database): `302` redirect to `route('contact', ['ref' => $code, ...$otherQueryParams])`.
    - Invalid shape: `302` redirect to `route('contact', $otherQueryParams)` (without `ref`).
    - When the redirected request lands on `/contact?ref={code}`, `AttributeReferral` sets the 30-day `okojie_referral` cookie.

### Portal Referrals Props & Invite Mail

- **Controller**: `App\Http\Controllers\Portal\ReferralController`
- `referralLink` (both in `portal/referrals` page props and `ReferralInvite` mailable) is generated via `route('referral.redirect', ['code' => $user->referral_code])` (e.g. `https://…/r/OKJ-674SU5`).
- `referralCode` (`OKJ-XXXXXX`) and `rewardRange` (`$25–$50`) remain unchanged.

---

## BE-17 — Saved Display Preferences (`compact_tables`, `reduce_motion`)

### Database & Model (`users`)

- Added columns:
    - `compact_tables` (`boolean`, default `false`)
    - `reduce_motion` (`boolean`, default `false`)
- Cast as `boolean` on `App\Models\User`.

### Route & Controller

- **Route**: `PATCH /settings/appearance/preferences` (`appearance.preferences.update`)
- **Middleware**: `auth`, `verified` (same middleware group as `appearance.edit`, not behind `RequirePassword`)
- **Controller**: `App\Http\Controllers\Settings\AppearanceController@update`
- **Form Request**: `App\Http\Requests\Settings\AppearancePreferencesUpdateRequest`
    - `compact_tables`: `sometimes|boolean`
    - `reduce_motion`: `sometimes|boolean`
- **Response**: Updates only the authenticated user and redirects `back()` for Inertia optimistic updates.
- **Theme**: `light` / `dark` / `system` remains client-side (`localStorage` + `appearance` cookie).

### Shared Inertia Prop (`HandleInertiaRequests`)

- `auth.user.preferences`:
    - `compactTables`: `bool`
    - `reduceMotion`: `bool`
