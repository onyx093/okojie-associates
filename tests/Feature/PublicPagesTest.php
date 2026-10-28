<?php

use Inertia\Testing\AssertableInertia as Assert;

test('home page renders successfully with all required props', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('home')
        ->has('tiers', 3)
        ->has('steps', 5)
        ->has('testimonials', 5)
        ->has('videos', 3)
        ->has('offices', 4)
        ->has('faqs', 8)
        ->has('stats', 4)
    );
});

test('services page renders successfully with tiers, addons, and faqs', function () {
    $response = $this->get(route('services'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('services')
        ->has('tiers', 3)
        ->has('addons', 5)
        ->has('faqs', 8)
    );
});

test('pricing page renders successfully with tiers, addons, and faqs', function () {
    $response = $this->get(route('pricing'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('pricing')
        ->has('tiers', 3)
        ->has('addons', 5)
        ->has('faqs', 8)
    );
});

test('about page renders successfully with stats and offices', function () {
    $response = $this->get(route('about'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('about')
        ->has('stats', 4)
        ->where('stats.0', ['value' => '26+', 'label' => 'Years serving PA & MD taxpayers'])
        ->where('stats.1', ['value' => '40,000+', 'label' => 'Returns prepared and filed'])
        ->where('stats.2', ['value' => '12', 'label' => 'Credentialed preparers'])
        ->where('stats.3', ['value' => '4', 'label' => 'Offices across Philadelphia & Baltimore'])
        ->has('offices', 4)
    );
});

test('contact page renders successfully with offices and tiers', function () {
    $response = $this->get(route('contact'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('contact')
        ->has('offices', 4)
        ->has('tiers', 3)
        ->where('initialTier', null)
        ->where('referralCode', null)
    );
});

test('contact page honors tier and referral code query parameters', function () {
    $response = $this->get(route('contact', ['tier' => 'hybrid', 'ref' => 'OKJ-674SU5']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('contact')
        ->where('initialTier', 'hybrid')
        ->where('referralCode', 'OKJ-674SU5')
    );
});

test('sitemap xml endpoint returns valid xml with all public pages', function () {
    $response = $this->get(route('sitemap'));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml');
    $content = $response->getContent();

    expect($content)
        ->toContain('<urlset')
        ->toContain('/services')
        ->toContain('/pricing')
        ->toContain('/about')
        ->toContain('/contact')
        ->toContain('/security')
        ->toContain('/privacy')
        ->toContain('/terms');
});
