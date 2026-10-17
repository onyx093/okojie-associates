<x-mail::message>
# Hello {{ $friendName }},

{{ $referrerName }} referred you to Okojie Online — real, credentialed tax preparers who know Philadelphia and Baltimore, with a secure online portal. Start your return here: {{ $link }}. No obligation.

<x-mail::button :url="$link">
Start Your Return
</x-mail::button>

Upload documents, review your estimate, and file whenever you're ready.

If you have any questions, our local team is here to help:
- **Phone:** (215) 555-0142
- **Email:** hello@okojieonline.com
- **Hours:** Mon–Fri 9am–6pm

Thanks,<br>
The Team at {{ config('app.name') }}<br>
*Okojie & Associates, Inc. — 4 Offices across Philadelphia & Baltimore*
</x-mail::message>
