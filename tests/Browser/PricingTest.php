<?php

it('renders the pricing page band, compare table, addons strip, payment steps, and faqs with no smoke errors', function () {
    visit('/pricing')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Clear prices')
        ->assertSeeIn('header[class]', 'No surprises')
        ->assertSeeIn('header[class] p', 'Fees are shown as starting ranges')
        ->assertSeeIn('section#compare h2', 'What each tier includes')
        ->assertSeeIn('section#compare table thead', 'Upload & Go')
        ->assertSeeIn('section#compare table thead', 'Hybrid')
        ->assertSeeIn('section#compare table thead', 'Most popular')
        ->assertSeeIn('section#compare table thead', 'Premium Remote')
        ->assertSeeIn('section#compare table tbody', 'Preparation')
        ->assertSeeIn('section#compare table tbody', 'How you work with us')
        ->assertSeeIn('section#addons h2', 'Add to any tier')
        ->assertSeeIn('section#addons', 'Amendments')
        ->assertSeeIn('section#addons', 'IRS notices')
        ->assertSeeIn('section#addons', 'ITIN')
        ->assertSeeIn('section#addons', 'Bookkeeping')
        ->assertSeeIn('section#addons', 'Quarterly estimates')
        ->assertSeeIn('section#how-it-works h2', 'You see the price before you pay')
        ->assertSeeIn('section#how-it-works', '01')
        ->assertSeeIn('section#how-it-works', 'We review your documents')
        ->assertSeeIn('section#how-it-works', '02')
        ->assertSeeIn('section#how-it-works', 'You approve and pay online')
        ->assertSeeIn('section#how-it-works', '03')
        ->assertSeeIn('section#how-it-works', 'Your receipt is saved')
        ->assertSeeIn('section#faq h2', 'Pricing questions')
        ->assertSeeIn('section#faq details:first-of-type', 'How much will my return cost?')
        ->assertSeeIn('section#faq details:nth-of-type(2)', 'When do I pay?')
        ->assertScript('document.querySelector("#faq details")?.hasAttribute("open")', true);
});

it('supports toggling pricing FAQ details open and closed', function () {
    visit('/pricing')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#faq details")?.hasAttribute("open")', true)
        ->click('#faq details:nth-of-type(2) summary')
        ->assertScript('document.querySelectorAll("#faq details")[1]?.hasAttribute("open")', true)
        ->assertSeeIn('#faq details:nth-of-type(2) p', 'After your preparer sets your fee and before we e-file');
});

it('routes guest comparison CTA to register with tier param', function () {
    visit('/pricing')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("th.bg-accent-soft a")?.getAttribute("href")', '/register?tier=hybrid');
});

it('renders styleguide page-pricing fixture states for guest and authed', function () {
    visit('/dev/styleguide?fixture=page-pricing&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Clear prices');

    visit('/dev/styleguide?fixture=page-pricing&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Current');
});
