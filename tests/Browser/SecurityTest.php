<?php

it('renders the security page band, tabs, toc, draft note, numbered sections, and contact line with no smoke errors', function () {
    visit('/security')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Security and data safeguards')
        ->assertSeeIn('header[class]', 'Security (WISP)')
        ->assertSeeIn('header[class] [role="tablist"]', 'Privacy')
        ->assertSeeIn('header[class] [role="tablist"]', 'Terms')
        ->assertSeeIn('header[class] [role="tablist"]', 'Security')
        ->assertScript('document.querySelector(\'[role="tab"][aria-selected="true"]\')?.textContent?.trim()', 'Security')
        ->assertSeeIn('nav[aria-label="On this page"]', 'On this page')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Written information security plan')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Encryption and storage')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Multi-factor authentication')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Incident response')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Questions')
        ->assertSeeIn('[role="note"]', 'Draft wording.')
        ->assertSeeIn('[role="note"]', 'This page needs to be reviewed and replaced by legal counsel before launch.')
        ->assertSeeIn('.meta-row', 'Last updated Oct 22, 2026')
        ->assertSeeIn('.meta-row', 'Print this page')
        ->assertSeeIn('article.doc h2#written-information-security-plan', '01')
        ->assertSeeIn('article.doc h2#written-information-security-plan', 'Written information security plan')
        ->assertSeeIn('article.doc h2#encryption-and-storage', '02')
        ->assertSeeIn('article.doc h2#encryption-and-storage', 'Encryption and storage')
        ->assertSeeIn('article.doc h2#multi-factor-authentication', '03')
        ->assertSeeIn('article.doc h2#multi-factor-authentication', 'Multi-factor authentication')
        ->assertSeeIn('article.doc h2#incident-response', '04')
        ->assertSeeIn('article.doc h2#incident-response', 'Incident response')
        ->assertSeeIn('article.doc h2#contact', '05')
        ->assertSeeIn('article.doc h2#contact', 'Questions')
        ->assertScript('document.querySelector("a[href=\'tel:+12155550142\']") !== null', true)
        ->assertScript('document.querySelector("a[href=\'mailto:hello@okojieonline.com\']") !== null', true);
});

it('renders the security page on mobile viewport cleanly with no smoke errors', function () {
    visit('/security')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Security and data safeguards')
        ->assertSeeIn('nav[aria-label="On this page"]', 'On this page')
        ->assertSeeIn('article.doc h2#written-information-security-plan', 'Written information security plan')
        ->assertSeeIn('article.doc h2#contact', 'Questions');
});

it('can navigate between legal document tabs from security to privacy and terms', function () {
    visit('/security')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('a[role="tab"]:has-text("Privacy")')
        ->assertPathIs('/privacy');

    visit('/security')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('a[role="tab"]:has-text("Terms")')
        ->assertPathIs('/terms');
});

it('renders styleguide page-security fixture states for guest and authed', function () {
    visit('/dev/styleguide?fixture=page-security&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Security and data safeguards');

    visit('/dev/styleguide?fixture=page-security&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Security and data safeguards');
});
