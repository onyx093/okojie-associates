<?php

it('renders the home page hero, stats, and sections with no console or smoke errors', function () {
    visit('/')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class]', '26+ years')
        ->assertSeeIn('header[class]', 'Start my return online')
        ->assertSeeIn('header[class]', 'Book a free consultation')
        ->assertScript('Boolean(document.querySelector(\'[role="img"][aria-label*="Okojie Online client portal"]\'))', true)
        ->assertSeeIn('main#main dl', '26+')
        ->assertSeeIn('main#main dl', '40,000+')
        ->assertSeeIn('main#main dl', 'Years in business')
        ->assertSeeIn('main#main dl', 'Offices in PA & MD')
        ->assertSeeIn('#tiers', 'Three ways to file')
        ->assertSeeIn('#tiers', 'Most popular')
        ->assertSeeIn('section[aria-labelledby="how-title"]', 'From start to filed, without an office visit')
        ->assertSeeIn('#offices', 'Find us in person')
        ->assertSeeIn('#start', 'Start your return online')
        ->assertSeeIn('#faq', 'Questions, answered');
});

it('routes guest tier and referral actions appropriately', function () {
    visit('/')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector(\'a[href*="/register?tier=upload_and_go"]\')?.textContent?.trim()', 'Choose Upload & Go')
        ->assertScript('Boolean(document.querySelector(\'a[href*="/register?next="]\'))', true);
});

it('supports keyboard navigation across video category tabs', function () {
    visit('/')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#video-tab-0")?.getAttribute("aria-selected")', 'true')
        ->click('#video-tab-0')
        ->keys('#video-tab-0', 'ArrowRight')
        ->assertScript('document.querySelector("#video-tab-1")?.getAttribute("aria-selected")', 'true')
        ->assertScript('document.querySelector("#video-panel-1")?.hasAttribute("hidden")', false);
});

it('toggles FAQ details open and closed', function () {
    visit('/')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#faq details")?.hasAttribute("open")', true)
        ->click('#faq details:nth-of-type(2) summary')
        ->assertScript('document.querySelectorAll("#faq details")[1]?.hasAttribute("open")', true);
});

it('renders styleguide page-home fixture states including photo layer and submitted status', function () {
    visit('/dev/styleguide?fixture=page-home&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('Boolean(document.querySelector("header img"))', false);

    visit('/dev/styleguide?fixture=page-home&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Your current tier');

    visit('/dev/styleguide?fixture=page-home&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('Boolean(document.querySelector("header img[src*=\"og-image.png\"]"))', true);

    visit('/dev/styleguide?fixture=page-home&state=3')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Quote request received');
});
