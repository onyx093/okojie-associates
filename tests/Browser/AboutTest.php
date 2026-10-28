<?php

it('renders the about page band, story, stats, team with note, security cards, and offices with no smoke errors', function () {
    visit('/about')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'A neighborhood firm')
        ->assertSeeIn('header[class]', 'now online')
        ->assertSeeIn('header[class] p', 'For more than 26 years')
        ->assertSeeIn('section[aria-labelledby="story-t"] h2', 'The same people, a lot less hassle')
        ->assertSeeIn('section[aria-labelledby="story-t"]', '26+')
        ->assertSeeIn('section[aria-labelledby="story-t"]', 'Years serving PA & MD taxpayers')
        ->assertSeeIn('section[aria-labelledby="story-t"]', '40,000+')
        ->assertSeeIn('section[aria-labelledby="story-t"]', 'Returns prepared and filed')
        ->assertSeeIn('section[aria-labelledby="story-t"]', '12')
        ->assertSeeIn('section[aria-labelledby="story-t"]', 'Credentialed preparers')
        ->assertSeeIn('section[aria-labelledby="story-t"]', 'Offices across Philadelphia & Baltimore')
        ->assertSeeIn('section[aria-labelledby="team-t"] h2', 'Meet your preparers')
        ->assertSeeIn('section[aria-labelledby="team-t"]', 'Adaeze Okojie, EA')
        ->assertSeeIn('section[aria-labelledby="team-t"]', 'Kofi Boateng')
        ->assertSeeIn('section[aria-labelledby="team-t"]', 'Ngozi Mbah, EA')
        ->assertSeeIn('section[aria-labelledby="team-t"]', 'Tobi Adeyemi')
        ->assertSeeIn('section[aria-labelledby="team-t"] p', 'Sample team. Replace with real names, titles and photos.')
        ->assertSeeIn('section[aria-labelledby="sec-t"] h2', 'Your data is protected')
        ->assertSeeIn('section[aria-labelledby="sec-t"]', 'IRS Publication 4557')
        ->assertSeeIn('section[aria-labelledby="sec-t"]', 'FTC Safeguards Rule')
        ->assertSeeIn('section[aria-labelledby="sec-t"]', 'Multi-factor authentication')
        ->assertSeeIn('section[aria-labelledby="sec-t"]', 'IRS-compliant e-signature')
        ->assertSeeIn('section[aria-labelledby="off-t"] h2', 'Find us in person')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '5601 Germantown Ave')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '2301 N. Broad St')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '6300 W. Chelten Ave')
        ->assertSeeIn('section[aria-labelledby="off-t"]', '4100 Liberty Heights Ave')
        ->assertScript('document.querySelector("a[href=\'tel:+12155550142\']") !== null', true)
        ->assertScript('document.querySelector("a[href=\'tel:+14105550166\']") !== null', true);
});

it('renders the about page on mobile viewport cleanly with no smoke errors', function () {
    visit('/about')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'A neighborhood firm')
        ->assertSeeIn('section[aria-labelledby="story-t"] h2', 'The same people, a lot less hassle')
        ->assertSeeIn('section[aria-labelledby="team-t"] h2', 'Meet your preparers')
        ->assertSeeIn('section[aria-labelledby="sec-t"] h2', 'Your data is protected')
        ->assertSeeIn('section[aria-labelledby="off-t"] h2', 'Find us in person');
});

it('renders styleguide page-about fixture states for guest and authed', function () {
    visit('/dev/styleguide?fixture=page-about&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'A neighborhood firm');

    visit('/dev/styleguide?fixture=page-about&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('header[class] h1', 'A neighborhood firm');
});
