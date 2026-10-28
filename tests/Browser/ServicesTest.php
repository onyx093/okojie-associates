<?php

it('renders the services page band, tiers, addons, guide, and faqs with no smoke errors', function () {
    visit('/services')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Tax help that fits')
        ->assertSeeIn('header[class]', 'Help me choose')
        ->assertSeeIn('header[class]', 'Compare prices')
        ->assertSeeIn('section#tiers', 'Three ways to file')
        ->assertSeeIn('section#tiers h3', 'Upload & Go')
        ->assertSeeIn('section#tiers h3', 'Hybrid')
        ->assertSeeIn('section#tiers', 'Most popular')
        ->assertSeeIn('section#tiers h3', 'Premium Remote')
        ->assertSeeIn('section#tiers', 'Choose Hybrid')
        ->assertSeeIn('section#tiers', 'Book a free consultation')
        ->assertSeeIn('section#addons', 'Extra help, when you need it')
        ->assertSeeIn('section#addons b', 'Bookkeeping')
        ->assertSeeIn('section#addons', '/ mo')
        ->assertSeeIn('section#guide', 'Find your tier in three questions')
        ->assertSeeIn('section#guide [role="status"]', 'Upload & Go')
        ->assertSeeIn('section#guide [role="status"]', '$150–$225')
        ->assertSeeIn('section#faq', 'Choosing a service')
        ->assertSeeIn('section#faq details:first-of-type', 'Do I have to come into an office?')
        ->assertScript('document.querySelector("#faq details")?.hasAttribute("open")', true);
});

it('interactively recalculates the recommended tier in the tier finder', function () {
    visit('/services')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#g-name")?.textContent?.trim()', 'Upload & Go')
        ->assertScript('document.querySelector("#g-price")?.textContent?.trim()', '$150–$225')
        ->assertScript('document.querySelector("#guide [role=\"status\"] a")?.getAttribute("href")', '/register?tier=upload_and_go')
        // Selecting "In an office" should recommend Hybrid
        ->click('label[for="meet-office"]')
        ->assertScript('document.querySelector("#g-name")?.textContent?.trim()', 'Hybrid')
        ->assertScript('document.querySelector("#g-price")?.textContent?.trim()', '$225–$350')
        ->assertScript('document.querySelector("#guide [role=\"status\"] a")?.getAttribute("href")', '/register?tier=hybrid')
        // Selecting "Self-employed or 1099" should recommend Premium Remote
        ->click('label[for="inc-se"]')
        ->assertScript('document.querySelector("#g-name")?.textContent?.trim()', 'Premium Remote')
        ->assertScript('document.querySelector("#g-price")?.textContent?.trim()', '$400–$900')
        ->assertScript('document.querySelector("#guide [role=\"status\"] a")?.getAttribute("href")', '/register?tier=premium_remote')
        // Returning to W-2 with multi-state still recommends Premium Remote
        ->click('label[for="inc-w2"]')
        ->click('label[for="st-multi"]')
        ->assertScript('document.querySelector("#g-name")?.textContent?.trim()', 'Premium Remote')
        ->assertScript('document.querySelector("#g-price")?.textContent?.trim()', '$400–$900')
        ->assertScript('document.querySelector("#guide [role=\"status\"] a")?.getAttribute("href")', '/register?tier=premium_remote');
});

it('supports toggling FAQ details open and closed', function () {
    visit('/services')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#faq details")?.hasAttribute("open")', true)
        ->click('#faq details:nth-of-type(2) summary')
        ->assertScript('document.querySelectorAll("#faq details")[1]?.hasAttribute("open")', true);
});

it('renders styleguide page-services fixture states including all 16 truth table combos', function () {
    visit('/dev/styleguide?fixture=page-services&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class]', 'Tax help that fits');

    visit('/dev/styleguide?fixture=page-services&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Your current tier');

    visit('/dev/styleguide?fixture=page-services&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Tier Finder Truth Table (All 16 Combinations)')
        ->assertScript('document.querySelectorAll("tbody tr").length', 16);
});
