<?php

return [
    'brand' => [
        'legal_name' => 'Okojie & Associates, Inc.',
        'product' => 'Okojie Online',
        'mark' => 'O',
    ],
    'tagline' => 'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore.',
    'footer_blurb' => 'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Serving individuals, families, and small businesses for 26+ years.',
    'contact' => [
        'phone' => '(215) 555-0142',
        'email' => 'hello@okojieonline.com',
        'staff_email' => env('STAFF_NOTIFY_EMAIL', 'staff@okojieonline.com'),
        'hours' => 'Mon–Fri 9am–6pm',
    ],
    'stats' => [
        'years' => '26+',
        'returns' => '40,000+',
        'preparers' => '12',
        'offices' => '4',
    ],
    'referral' => [
        'code_prefix' => 'OKJ',
        'reward_range' => '$25–$50',
        'reward_cents' => [
            'upload_and_go' => 2500,
            'hybrid' => 5000,
            'premium_remote' => 5000,
        ],
    ],
    'compliance' => 'IRS Publication 4557 & FTC Safeguards compliant · Written Information Security Plan (WISP)',
    'seo' => [
        'title' => 'Okojie & Associates, Inc. — Okojie Online Tax Preparation',
        'description' => 'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Secure portal, e-sign, and e-file with Okojie & Associates.',
    ],
    'offices' => [
        [
            'city' => 'Philadelphia, PA',
            'address' => '5601 Germantown Ave',
            'phone' => '(215) 555-0142',
            'hours' => 'Mon–Fri 9am–6pm · Sat 10am–2pm',
        ],
        [
            'city' => 'Philadelphia, PA',
            'address' => '2301 N. Broad St',
            'phone' => '(215) 555-0178',
            'hours' => 'Mon–Fri 9am–6pm',
        ],
        [
            'city' => 'Philadelphia, PA',
            'address' => '6300 W. Chelten Ave',
            'phone' => '(215) 555-0193',
            'hours' => 'Mon–Fri 9am–5pm · Sat 10am–1pm',
        ],
        [
            'city' => 'Baltimore, MD',
            'address' => '4100 Liberty Heights Ave',
            'phone' => '(410) 555-0166',
            'hours' => 'Mon–Fri 9am–6pm',
        ],
    ],
];
