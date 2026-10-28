<?php

it('swaps SiteLayout navigation actions between guest and authenticated states', function () {
    visit('/dev/styleguide?fixture=layout-site&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('nav[aria-label="Primary"]', 'Client login')
        ->assertSeeIn('nav[aria-label="Primary"]', 'Start my return')
        ->assertDontSeeIn('nav[aria-label="Primary"]', 'My portal')
        ->assertScript('document.querySelector(\'nav[aria-label="Primary"] a[aria-current="page"]\')?.textContent?.trim()', 'Services');

    visit('/dev/styleguide?fixture=layout-site&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('nav[aria-label="Primary"]', 'My portal')
        ->assertDontSeeIn('nav[aria-label="Primary"]', 'Start my return');
});

it('opens and closes the SiteLayout mobile navigation sheet below the nav breakpoint', function () {
    visit('/dev/styleguide?fixture=layout-site&state=0')
        ->on()->mobile()
        ->assertNoSmoke()
        ->click('[aria-label="Open menu"]')
        ->assertSeeIn('nav[aria-label="Mobile navigation"]', 'Services')
        ->assertSee('Start my return')
        ->assertSee('Client login')
        ->keys('[data-slot="sheet-content"]', 'Escape')
        ->assertScript('document.querySelector(\'[aria-label="Open menu"]\')?.getAttribute("aria-expanded")', 'false');
});

it('manages AppShellLayout mobile drawer focus and closes on Escape', function () {
    visit('/dev/styleguide?fixture=layout-app-shell&state=0')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("aside")?.getAttribute("data-open")', 'false')
        ->click('[aria-label="Open navigation"]')
        ->assertScript('document.querySelector("aside")?.getAttribute("data-open")', 'true')
        ->assertScript('document.querySelector("aside")?.contains(document.activeElement)', true)
        ->keys('aside a[aria-current="page"]', 'Escape')
        ->assertScript('document.querySelector("aside")?.getAttribute("data-open")', 'false')
        ->assertScript('document.activeElement?.getAttribute("aria-label")', 'Open navigation');
});

it('persists theme toggle changes across v2 layouts in localStorage and root attributes', function () {
    $page = visit('/dev/styleguide?fixture=layout-auth-screen&state=0')
        ->inLightMode()
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.documentElement.classList.contains("dark")', false)
        ->click('[aria-label="Switch to dark theme"]')
        ->assertScript('document.documentElement.classList.contains("dark")', true)
        ->assertScript('window.localStorage.getItem("appearance")', 'dark');

    $page->click('[aria-label="Switch to light theme"]')
        ->assertScript('document.documentElement.classList.contains("dark")', false)
        ->assertScript('window.localStorage.getItem("appearance")', 'light');
});

it('renders role-aware AppShellLayout and SettingsShellLayout navigation and badge counts', function () {
    visit('/dev/styleguide?fixture=layout-app-shell&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('aside[data-open]', 'Okojie Online')
        ->assertSeeIn('aside[data-open] nav', 'Documents')
        ->assertSeeIn('a:has-text("Documents")', '4')
        ->assertSeeIn('aside[data-open] nav', 'Messages')
        ->assertSeeIn('a:has-text("Messages")', '2')
        ->assertSeeIn('aside[data-open]', 'Questions about your return?');

    visit('/dev/styleguide?fixture=layout-app-shell&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('aside[data-open]', 'Okojie Staff')
        ->assertSeeIn('aside[data-open] nav', 'Clients')
        ->assertSeeIn('a:has-text("Clients")', '28')
        ->assertSeeIn('aside[data-open] nav', 'Leads')
        ->assertSeeIn('a:has-text("Leads")', '5');

    visit('/dev/styleguide?fixture=layout-settings-shell&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('nav[aria-label="Settings"]', 'Profile')
        ->assertSeeIn('nav[aria-label="Settings"]', 'Security')
        ->assertSeeIn('nav[aria-label="Settings"]', 'Appearance')
        ->assertScript('document.querySelector(\'nav[aria-label="Settings"] a[aria-current="page"]\')?.textContent?.trim()', 'Profile');
});
