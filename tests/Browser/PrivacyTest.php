<?php

it('renders the privacy page band, tabs, toc, draft note, numbered sections, and contact line with no smoke errors', function () {
    visit('/privacy')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Privacy policy')
        ->assertSeeIn('header[class]', 'Privacy & compliance')
        ->assertSeeIn('header[class] [role="tablist"]', 'Privacy')
        ->assertSeeIn('header[class] [role="tablist"]', 'Terms')
        ->assertSeeIn('header[class] [role="tablist"]', 'Security')
        ->assertScript('document.querySelector(\'[role="tab"][aria-selected="true"]\')?.textContent?.trim()', 'Privacy')
        ->assertSeeIn('nav[aria-label="On this page"]', 'On this page')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Information we collect')
        ->assertSeeIn('nav[aria-label="On this page"]', 'IRC Section 7216 consent')
        ->assertSeeIn('nav[aria-label="On this page"]', 'How we share information')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Record retention and disposal')
        ->assertSeeIn('nav[aria-label="On this page"]', 'Questions')
        ->assertSeeIn('[role="note"]', 'Draft wording.')
        ->assertSeeIn('[role="note"]', 'This page needs to be reviewed and replaced by legal counsel before launch.')
        ->assertSeeIn('.meta-row', 'Last updated Oct 22, 2026')
        ->assertSeeIn('.meta-row', 'Print this page')
        ->assertSeeIn('article.doc h2#information-we-collect', '01')
        ->assertSeeIn('article.doc h2#information-we-collect', 'Information we collect')
        ->assertSeeIn('article.doc h2#irc-section-7216-consent', '02')
        ->assertSeeIn('article.doc h2#irc-section-7216-consent', 'IRC Section 7216 consent')
        ->assertSeeIn('article.doc h2#how-we-share-information', '03')
        ->assertSeeIn('article.doc h2#how-we-share-information', 'How we share information')
        ->assertSeeIn('article.doc h2#record-retention-and-disposal', '04')
        ->assertSeeIn('article.doc h2#record-retention-and-disposal', 'Record retention and disposal')
        ->assertSeeIn('article.doc h2#contact', '05')
        ->assertSeeIn('article.doc h2#contact', 'Questions')
        ->assertScript('document.querySelector("a[href=\'tel:+12155550142\']") !== null', true)
        ->assertScript('document.querySelector("a[href=\'mailto:hello@okojieonline.com\']") !== null', true);
});

it('renders the privacy page on mobile viewport cleanly with no smoke errors', function () {
    visit('/privacy')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Privacy policy')
        ->assertSeeIn('nav[aria-label="On this page"]', 'On this page')
        ->assertSeeIn('article.doc h2#information-we-collect', 'Information we collect')
        ->assertSeeIn('article.doc h2#contact', 'Questions');
});

it('can navigate between legal document tabs from privacy to terms and security', function () {
    visit('/privacy')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('a[role="tab"]:has-text("Terms")')
        ->assertPathIs('/terms');

    visit('/privacy')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('a[role="tab"]:has-text("Security")')
        ->assertPathIs('/security');
});

it('renders styleguide page-privacy fixture states for guest and authed', function () {
    visit('/dev/styleguide?fixture=page-privacy&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Privacy policy');

    visit('/dev/styleguide?fixture=page-privacy&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Privacy policy');
});
