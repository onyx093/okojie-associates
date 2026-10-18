<x-mail::message>
# Payment Receipt

Hello {{ $clientName }},

Thank you for your payment! This email confirms your payment for tax preparation services with Okojie & Associates, Inc.

**Payment Details:**
- **Amount Paid:** {{ $amount }}
- **Tax Year:** {{ $taxYear }}
- **Date & Time:** {{ $paidAt }}
- **Receipt / Invoice ID:** `{{ $invoiceId }}`
- **Payment Method:** Electronic card checkout (Stripe)

Your payment has been recorded and your return is progressing smoothly through our preparation and review pipeline. You can review your return status, documents, and messages anytime by signing in to your secure client portal.

<x-mail::button :url="$portalUrl">
Go to Client Portal
</x-mail::button>

If you have any questions about this receipt or your return, please reply to this email or call us at (215) 555-0142.

Thanks,<br>
The Team at {{ config('app.name') }}<br>
*Okojie & Associates, Inc. — 4 Offices across Philadelphia & Baltimore*
</x-mail::message>
