<?php

it('renders the terms page band, tabs, toc, draft note, numbered sections, and contact line with no smoke errors', function () {
    visit('/terms')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Terms of service')
        ->assertSeeIn('header[class]', 'Engagement terms')
        ->assertSeeIn('header[class] [role="tablist"]', 'Privacy')
        ->assertSeeIn('header[class] [role="tablist"]', 'Terms')
        ->assertSeeIn('header[class] [role="tablist"]', 'Security')
        ->assertScript('document.querySelector(\'[role="tab"][aria-selected="true"]\')?.textContent?.trim()', 'Terms')
        ->assertSeeIn('nav[aria-label="On this page"]', 'On this page')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Scope of engagement')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Your responsibilities')
        ->assertSeeIn('nav[aria-label="On this page"]', 'E-signature and Form 8879')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Invoices, payments and refunds')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Questions')
        ->assertSeeIn('[role="note"]', 'Draft wording.')
        ->assertSeeIn('[role="note"]', 'This page needs to be reviewed and replaced by legal counsel before launch.')
        ->assertSeeIn('.meta-row', 'Last updated Oct 22, 2026')
        ->assertSeeIn('.meta-row', 'Print this page')
        ->assertSeeIn('article.doc h2#scope-of-engagement', '01')
        ->assertSeeIn('article.doc h2#scope-of-engagement', 'Scope of engagement')
        ->assertSeeIn('article.doc h2#your-responsibilities', '02')
        ->assertSeeIn('article.doc h2#your-responsibilities', 'Your responsibilities')
        ->assertSeeIn('article.doc h2#e-signature-and-form-8879', '03')
        ->assertSeeIn('article.doc h2#e-signature-and-form-8879', 'E-signature and Form 8879')
        ->assertSeeIn('article.doc h2#invoices-payments-and-refunds', '04')
        ->assertSeeIn('article.doc h2#invoices-payments-and-refunds', 'Invoices, payments and refunds')
        ->assertSeeIn('article.doc h2#contact', '05')
        ->assertSeeIn('article.doc h2#contact', 'Questions')
        ->assertScript('document.querySelector("a[href=\'tel:+12155550142\']") !== null', true)
        ->assertScript('document.querySelector("a[href=\'mailto:hello@okojieonline.com\']") !== null', true);
});

it('renders the terms page on mobile viewport cleanly with no smoke errors', function () {
    visit('/terms')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Terms of service')
        ->assertSeeIn('nav[aria-label="On this page"]', 'On this page')
        ->assertSeeIn('article.doc h2#scope-of-engagement', 'Scope of engagement')
        ->assertSeeIn('article.doc h2#contact', 'Questions');
});

it('can navigate between legal document tabs from terms to privacy and security', function () {
    visit('/terms')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('a[role="tab"]:has-text("Privacy")')
        ->assertPathIs('/privacy');

    visit('/terms')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('a[role="tab"]:has-text("Security")')
        ->assertPathIs('/security');
});

it('renders styleguide page-terms fixture states for guest and authed', function () {
    visit('/dev/styleguide?fixture=page-terms&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Terms of service');

    visit('/dev/styleguide?fixture=page-terms&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Terms of service');
});
