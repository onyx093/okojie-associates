<?php

use App\Models\Lead;

beforeEach(function () {
    config(['honeypot.valid_from_timestamp' => false]);
});

it('renders the contact page band, ways cards, quote form tab, defaults, and offices list with no smoke errors', function () {
    visit('/contact')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Talk to a')
        ->assertSeeIn('header[class]', 'real person')
        ->assertSeeIn('header[class] p', 'Start your return online')
        ->assertSeeIn('section[aria-label="Ways to reach us"]', '(215) 555-0142')
        ->assertSeeIn('section[aria-label="Ways to reach us"]', 'hello@okojieonline.com')
        ->assertSeeIn('section[aria-label="Ways to reach us"]', 'Mon–Fri 9am–6pm')
        ->assertSeeIn('section#start h2', 'Tell us what you need')
        ->assertSeeIn('button#tab-quote', 'Get a free quote')
        ->assertSeeIn('button#tab-consult', 'Book a consultation')
        ->assertScript('document.querySelector("input[name=\'tier_interest\'][value=\'hybrid\']").checked', true)
        ->assertSeeIn('section#start form button[type="submit"]', 'Request my free quote')
        ->assertSeeIn('section[aria-labelledby="off-t"] h2', 'Find us in person')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '5601 Germantown Ave')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '2301 N. Broad St')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '6300 W. Chelten Ave')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '4100 Liberty Heights Ave')
        ->assertScript('document.querySelector("a[href*=\'maps/search\']") !== null', true);
});

it('tab switch persists shared field values across tabs and updates submit label and options', function () {
    visit('/contact')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#contact-name', 'Alex Mercer')
        ->fill('#contact-email', 'alex@example.com')
        ->fill('#contact-phone', '(215) 555-0199')
        ->click('#tab-consult')
        ->assertScript('document.querySelector("#contact-name").value', 'Alex Mercer')
        ->assertScript('document.querySelector("#contact-email").value', 'alex@example.com')
        ->assertScript('document.querySelector("#contact-phone").value', '(215) 555-0199')
        ->assertSeeIn('section#start form button[type="submit"]', 'Request a consultation')
        ->assertScript('document.querySelector("input[name=\'format\'][value=\'video\']").checked', true)
        ->assertScript('document.querySelector("#contact-time").value', 'any')
        ->click('#tab-quote')
        ->assertScript('document.querySelector("#contact-name").value', 'Alex Mercer')
        ->assertScript('document.querySelector("#contact-email").value', 'alex@example.com')
        ->assertScript('document.querySelector("#contact-phone").value', '(215) 555-0199')
        ->assertSeeIn('section#start form button[type="submit"]', 'Request my free quote');
});

it('deep links activate correct tabs, tier chips, and referral codes', function () {
    $page = visit('/contact')
        ->on()->desktop()
        ->assertNoSmoke();

    $page->script('window.location.hash = "#consult";');

    $page->assertScript('document.querySelector("#tab-consult").getAttribute("aria-selected")', 'true')
        ->assertSeeIn('section#start form button[type="submit"]', 'Request a consultation');

    visit('/contact?type=consult')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#tab-consult").getAttribute("aria-selected")', 'true')
        ->assertSeeIn('section#start form button[type="submit"]', 'Request a consultation');

    visit('/contact?tier=premium_remote')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("input[name=\'tier_interest\'][value=\'premium_remote\']").checked', true);

    visit('/contact?ref=OKJ-DEMO123')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('section#start', 'OKJ-DEMO123');
});

it('submits quote and consultation leads successfully', function () {
    visit('/contact')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#contact-name', 'Morgan Taylor')
        ->fill('#contact-email', 'morgan@example.com')
        ->click('section#start form button[type="submit"]');

    expect(Lead::where('email', 'morgan@example.com')->exists())->toBeTrue();

    visit('/contact?type=consult')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#contact-name', 'Jordan Hayes')
        ->fill('#contact-email', 'jordan@example.com')
        ->fill('#contact-date', now()->addDays(5)->format('Y-m-d'))
        ->click('section#start form button[type="submit"]');

    expect(Lead::where('email', 'jordan@example.com')->exists())->toBeTrue();
});

it('renders the contact page on mobile viewport cleanly with no smoke errors', function () {
    visit('/contact')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Talk to a real person')
        ->assertSeeIn('section#start h2', 'Tell us what you need')
        ->assertSeeIn('section[aria-labelledby="off-t"] h2', 'Find us in person');
});

it('renders styleguide page-contact fixture states for guest and authed', function () {
    visit('/dev/styleguide?fixture=page-contact&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Talk to a real person');

    visit('/dev/styleguide?fixture=page-contact&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'Talk to a real person');
});
