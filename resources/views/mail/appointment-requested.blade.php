<x-mail::message>
@if($forStaff)
# New Appointment Request

A client has submitted an appointment request via the client portal.

**Client Details:**
- **Name:** {{ $user->name }}
- **Email:** [{{ $user->email }}](mailto:{{ $user->email }})
- **Phone:** {{ $user->phone ?? 'Not provided' }}

**Requested Appointment Details:**
- **Preferred Date:** {{ $preferredDate }}
- **Time Window:** {{ $timeWindow }}
- **Format:** {{ $format }}
@if($topic)
- **Topic:** {{ $topic }}
@endif
@if($notes)
- **Notes:** {{ $notes }}
@endif

<x-mail::button :url="config('app.url') . '/admin/appointments'">
View Appointments
</x-mail::button>
@else
# Hello {{ $firstName }},

We have received your appointment request. A tax preparer will review your preferred time and follow up with you shortly to confirm.

**Summary of your request:**
- **Preferred Date:** {{ $preferredDate }}
- **Time Window:** {{ $timeWindow }}
- **Format:** {{ $format }}
@if($topic)
- **Topic:** {{ $topic }}
@endif
@if($notes)
- **Notes:** {{ $notes }}
@endif

If you need to make changes or have questions before then, feel free to contact us:
- **Phone:** (215) 555-0142
- **Email:** hello@okojieonline.com
- **Hours:** Mon–Fri 9am–6pm

<x-mail::button :url="config('app.url') . '/portal/appointments'">
View in Portal
</x-mail::button>
@endif

Thanks,<br>
The Team at {{ config('app.name') }}<br>
*Okojie & Associates, Inc. — 4 Offices across Philadelphia & Baltimore*
</x-mail::message>
