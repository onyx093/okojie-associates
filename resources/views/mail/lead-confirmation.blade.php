<x-mail::message>
# Hello {{ $firstName }},

@if($lead->kind->value === 'quote')
Thanks, {{ $firstName }}! A preparer will follow up within one business day.

We have received your request for a tax preparation quote. One of our credentialed preparers will review your information and follow up with a personalized recommendation and starting estimate.

**Summary of your request:**
- **Service Tier:** {{ $lead->tier_interest ? ucwords(str_replace('_', ' ', $lead->tier_interest)) : 'Not sure' }}
@if($lead->situation)
- **Notes on your situation:** {{ $lead->situation }}
@endif
@else
Request received. We'll confirm your consultation by email shortly.

Our team has received your request for a free consultation. A preparer will review your details and confirm the appointment.

**Requested Consultation Details:**
- **Preferred Date:** {{ $lead->preferred_date ? $lead->preferred_date->format('M d, Y') : 'Flexible' }}
- **Time Window:** {{ $lead->time_window ? $lead->time_window->label() : 'Any' }}
- **Format:** {{ $lead->format ? $lead->format->label() : 'Video call' }}
@if($lead->notes)
- **Topics/Notes:** {{ $lead->notes }}
@endif
@endif

If you have urgent questions, you can always reach us directly:
- **Phone:** (215) 555-0142
- **Email:** hello@okojieonline.com
- **Hours:** Mon–Fri 9am–6pm

Thanks,<br>
The Team at {{ config('app.name') }}<br>
*Okojie & Associates, Inc. — 4 Offices across Philadelphia & Baltimore*
</x-mail::message>
