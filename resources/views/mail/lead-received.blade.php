<x-mail::message>
# New {{ $lead->kind->label() }} Request

A new lead has submitted a request through Okojie Online.

**Contact Details:**
- **Name:** {{ $lead->name }}
- **Email:** [{{ $lead->email }}](mailto:{{ $lead->email }})
- **Phone:** {{ $lead->phone ?? 'Not provided' }}
@if($lead->ref_code)
- **Referral Code:** {{ $lead->ref_code }}
@endif

@if($lead->kind->value === 'quote')
**Quote Details:**
- **Tier Interest:** {{ $lead->tier_interest ?? 'Not sure' }}
- **Situation:** {{ $lead->situation ?? 'None provided' }}
@else
**Consultation Details:**
- **Preferred Date:** {{ $lead->preferred_date ? $lead->preferred_date->format('M d, Y') : 'Flexible' }}
- **Time Window:** {{ $lead->time_window ? $lead->time_window->label() : 'Any' }}
- **Format:** {{ $lead->format ? $lead->format->label() : 'Video call' }}
- **Notes:** {{ $lead->notes ?? 'None provided' }}
@endif

<x-mail::button :url="config('app.url') . '/admin/leads'">
View in Admin
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
