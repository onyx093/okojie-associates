# Written Information Security Plan (WISP) Template

> **CRITICAL COMPLIANCE NOTICE & DISCLAIMER**
>
> **THIS DOCUMENT IS A STRUCTURAL TEMPLATE AND OPERATIONAL GUIDE ONLY. IT DOES NOT CONSTITUTE LEGAL, TAX, CYBERSECURITY, OR REGULATORY COMPLIANCE ADVICE, NOR DOES ITS ADOPTION GUARANTEE COMPLIANCE WITH IRS PUBLICATION 4557, IRS PUBLICATION 1345, THE FTC SAFEGUARDS RULE (16 CFR PART 314), THE GRAMM-LEACH-BLILEY ACT (GLBA), OR STATE DATA PROTECTION LAWS.**
>
> Every professional tax preparation firm operates with unique technologies, workflows, personnel, and physical facilities. You must review, adapt, and execute this document in consultation with qualified legal counsel and licensed cybersecurity advisors prior to formal adoption.

---

## 1. Objectives and Scope

### 1.1 Purpose

This Written Information Security Plan ("WISP") establishes administrative, technical, and physical safeguards for Okojie & Associates, Inc. to ensure:

1. The security, confidentiality, and integrity of customer and taxpayer information.
2. Protection against anticipated threats or hazards to the security or integrity of such information.
3. Protection against unauthorized access to or use of customer information that could result in substantial harm or inconvenience to any customer.
4. Compliance with the Federal Trade Commission (FTC) Standards for Safeguarding Customer Information (16 CFR Part 314), Section 501(b) of the Gramm-Leach-Bliley Act (GLBA), IRS Publication 4557 (_Safeguarding Taxpayer Data: A Guide for Your Business_), and IRS Publication 1345 (_Handbook for Authorized IRS e-file Providers_).

### 1.2 Scope

This WISP applies to all partners, employees, contractors, seasonal staff, and third-party vendors of Okojie & Associates, Inc. It governs all Personally Identifiable Information (PII) and Federal Tax Information (FTI) in electronic, paper, or vocal form, across:

- Web applications and client portals (Okojie Online)
- Database systems, cloud storage buckets, and backups
- Physical offices, file cabinets, and mailrooms
- Company-issued and authorized BYOD endpoints (workstations, laptops, mobile devices)
- Network infrastructure, VPNs, and communications channels

---

## 2. Program Coordinator (Qualified Individual)

Under FTC Safeguards Rule § 314.4(a), the firm designates a **Qualified Individual** responsible for overseeing, implementing, and enforcing this information security program:

- **Designated Coordinator:** `[Insert Name and Title, e.g., Managing Partner / Chief Technology Officer]`
- **Alternate / Deputy:** `[Insert Name and Title]`
- **Effective Date:** `[Insert Date]`
- **Annual Review Date:** `[Insert Date, recurring annually]`

### Coordinator Responsibilities:

1. Conducting and maintaining the risk assessment (§ 314.4(b)).
2. Designing, implementing, and testing administrative, technical, and physical safeguards (§ 314.4(c)).
3. Overseeing service providers and ensuring contract terms require equivalent safeguards (§ 314.4(f)).
4. Coordinating annual workforce security awareness training (§ 314.4(e)).
5. Managing incident response, containment, and statutory breach notifications (§ 314.4(h)).
6. Providing an annual written report on the WISP status to the firm's leadership or Board of Directors (§ 314.4(i)).

---

## 3. Risk Assessment

Okojie & Associates, Inc. performs an annual risk assessment (or upon substantial technology/operational changes) identifying reasonably foreseeable internal and external risks to taxpayer data across three primary domains:

1. **Employee Training and Management:** Risks of social engineering, credential reuse, improper data sharing, unauthorized browsing, or failure to recognize phishing attempts.
2. **Information Systems & Cloud Infrastructure:** Risks of network intrusion, software vulnerabilities, misconfigured object storage, unauthorized database queries, unpatched packages, or lack of multi-factor authentication.
3. **Physical and Environmental Security:** Risks of unauthorized facility access, paper document theft, unattended unlocked screens, or improper disposal of printed tax forms.

---

## 4. Technical Safeguards

In accordance with FTC Safeguards Rule § 314.4(c) and IRS Pub 4557, Okojie & Associates, Inc. enforces the following technical controls within the Okojie Online platform:

### 4.1 Access Control and Authentication

- **Multi-Factor Authentication (MFA):** Enforced for all preparers, administrators, and client portal users via TOTP (time-based one-time password) or FIDO2/WebAuthn passkeys. SMS OTP is prohibited for administrative or preparer access.
- **Role-Based Access Control (RBAC):** Preparers may only view records of clients explicitly assigned to them. Administrative actions are restricted to designated system administrators.
- **Session Management:** Web portal sessions terminate upon idle timeouts. Re-authentication is required for sensitive operations (password changes, 2FA management, e-signature, invoice payment).
- **Anti-Automated Attack Protection:** Cloudflare Turnstile bot verification and route-level rate limiting protect public authentication and intake endpoints.

### 4.2 Data Encryption

- **Data in Transit:** All network communication is encrypted using TLS 1.3. HTTP requests are strictly redirected to HTTPS with HTTP Strict Transport Security (`HSTS`) enabled.
- **Data at Rest:** All client tax documents, attachments, and database volumes are encrypted at rest using AES-256.
- **Secure File Storage:** Tax documents are stored in private, non-public cloud buckets with signed, time-limited download URLs. Direct public URL access to storage keys is blocked.

### 4.3 Application Hardening & Security Headers

- **Content Security Policy (CSP):** Strict CSP directives with cryptographic nonces prevent Cross-Site Scripting (XSS) and restrict script execution to authorized origins (e.g., Stripe, Cloudflare Turnstile).
- **Frame & Sniffing Protection:** `X-Frame-Options: DENY` prevents clickjacking; `X-Content-Type-Options: nosniff` prevents MIME-type confusion attacks.
- **Permissions-Policy & Referrer-Policy:** Browser APIs (camera, microphone, geolocation) are disabled where not required; `Referrer-Policy: strict-origin-when-cross-origin` protects sensitive referral parameters.
- **Automated Testing & Static Analysis:** Continuous integration runs `phpstan` (Larastan), `pint`, Pest test suites, and dependency security audits (`composer audit`, `npm audit`).

### 4.4 Audit Logging and Monitoring

- All administrative and preparer access to client returns, uploaded documents, e-signatures, invoices, and profile information writes an immutable `AuditLog` entry capturing the actor ID, client ID, action, timestamp, and IP address.
- Logs are reviewed periodically for anomalous access patterns.

---

## 5. Physical and Administrative Safeguards

### 5.1 Facility Security

- Physical office doors remain locked after business hours with controlled access (electronic keycard or monitored deadbolt).
- Paper tax files must be locked in fireproof filing cabinets when unattended.
- A "Clean Desk Policy" requires all tax documents, notes with SSNs, and printed forms to be locked away when staff leave their desks.

### 5.2 Endpoint and Device Security

- All workstations and laptops connecting to the firm's network must have full-disk encryption enabled (macOS FileVault or Windows BitLocker).
- Automatic screen locks activate after 5 minutes of inactivity.
- Operating system and security patches must be installed within 14 days of release.
- Storing unencrypted client tax documents on local hard drives or removable media (USB drives) is strictly prohibited.

### 5.3 Secure Document Retention and Disposal

- Paper records scheduled for destruction must be cross-cut shredded or collected by a NAID-certified secure destruction vendor.
- Electronic media containing taxpayer data must be cryptographically wiped or physically destroyed before disposal or recycling.
- Taxpayer records are retained according to IRS and statutory rules (generally 3–7 years) and purged in accordance with data retention policies.

---

## 6. Service Provider Oversight

Pursuant to FTC § 314.4(f), Okojie & Associates, Inc. takes reasonable steps to select and retain service providers that maintain appropriate safeguards:

1. **Due Diligence:** Evaluate vendors’ security posture (SOC 2 Type II reports, ISO 27001 certifications, privacy policies).
2. **Contractual Protections:** Require written agreements ensuring providers implement safeguards satisfying FTC Safeguards Rule requirements.
3. **Approved Providers Inventory:**
    - **Cloud Infrastructure & Hosting:** AWS / Laravel Cloud (SOC 2, ISO 27001).
    - **Payment Processing:** Stripe (PCI-DSS Level 1 Service Provider; client payment card data never touches firm servers).
    - **Bot Mitigation & CDN:** Cloudflare (SOC 2 Type II).
    - **Transactional Email:** Postmark / AWS SES (TLS 1.2+ mandatory delivery).

---

## 7. Workforce Training and Awareness

1. **Onboarding Training:** All new hires (including temporary/seasonal preparers) must complete WISP and cybersecurity training before being granted access to systems.
2. **Annual Refresher:** Mandatory annual training covers:
    - Recognizing phishing, spear-phishing, and Business Email Compromise (BEC).
    - Safe credential handling and multi-factor authentication.
    - IRS Form 7216 consent requirements before disclosing or using tax return information.
    - Reporting suspected security incidents immediately.
3. **Disciplinary Action:** Violations of this WISP may result in disciplinary action up to and including termination of employment and civil/criminal liability.

---

## 8. Incident Response and Breach Notification Plan

In the event of a suspected or confirmed security incident involving unauthorized access, exposure, or theft of taxpayer data, the Qualified Individual must immediately execute this incident response procedure:

### 8.1 Containment and Eradication

1. Isolate compromised workstations, credentials, or network segments.
2. Revoke active sessions and force credential/MFA resets for affected accounts.
3. Preserve forensic evidence, server logs, audit trails, and disk images.
4. Engage external cybersecurity incident response professionals if necessary.

### 8.2 Statutory Notifications

In compliance with IRS Publication 4557, FTC Safeguards Rule § 314.4(h), and applicable state notification laws:

1. **IRS Stakeholder Liaison:** Notify the local IRS Stakeholder Liaison immediately upon confirmation of unauthorized access to taxpayer data or electronic filing credentials (EFIN/PTIN).
    - _Contact Directory:_ https://www.irs.gov/businesses/small-businesses-self-employed/stakeholder-liaison
2. **Federal Trade Commission (FTC):** If an unauthorized acquisition involves customer information of 500 or more consumers, submit electronic notice via the FTC electronic portal within **30 days** of discovery (§ 314.4(h)).
3. **State Tax Agencies and Attorneys General:** Notify relevant state departments of revenue (Federation of Tax Administrators protocols) and state Attorneys General per state breach notification statutes.
4. **Affected Clients / Taxpayers:** Provide prompt written notification to affected taxpayers detailing the incident, data elements involved, remediation steps taken, and recommended identity theft protective measures (e.g., IRS IP PIN, credit freezes).
5. **Law Enforcement:** Contact the local FBI Cyber Task Force and local Secret Service Field Office if ransomware, extortion, or systemic cyber intrusion is involved.

---

## 9. Periodic Review and Continuous Improvement

This WISP is a living document. The Qualified Individual must:

1. Conduct a comprehensive review of this plan at least **annually** (or within 30 days of any security incident or major architectural change).
2. Update risk assessments, safeguard specifications, and vendor inventories accordingly.
3. Submit an annual written report on the operational health of the security program to firm management.

---

### Acknowledgement and Adoption

By signature below, the management of Okojie & Associates, Inc. adopts this Written Information Security Plan as the official data security policy of the firm.

**Firm Managing Partner / Principal:**

Signature: ___________________________________________  
Name: ________________________________________________  
Title: _______________________________________________  
Date: ________________________________________________
