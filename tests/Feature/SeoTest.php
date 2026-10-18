<?php

use Inertia\Testing\AssertableInertia as Assert;

test('legal pages render successfully with counsel review placeholders', function (string $routeName, string $component) {
    $response = $this->get(route($routeName));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['security', 'legal/security'],
    ['privacy', 'legal/privacy'],
    ['terms', 'legal/terms'],
]);

test('robots txt contains disallow rules for protected areas', function () {
    $robotsPath = public_path('robots.txt');

    expect(file_exists($robotsPath))->toBeTrue();

    $content = file_get_contents($robotsPath);

    expect($content)
        ->toContain('Disallow: /portal/')
        ->toContain('Disallow: /admin/')
        ->toContain('Disallow: /login')
        ->toContain('Disallow: /register')
        ->toContain('Sitemap:');
});

test('og image exists in public directory with expected dimensions', function () {
    $ogPath = public_path('og-image.png');

    expect(file_exists($ogPath))->toBeTrue();

    $size = getimagesize($ogPath);
    expect($size)->not->toBeFalse();
    expect($size[0])->toBe(1200);
    expect($size[1])->toBe(630);
});

test('sitemap xml includes legal pages and standard pages', function () {
    $response = $this->get(route('sitemap'));

    $response->assertOk();
    $content = (string) $response->getContent();

    expect($content)
        ->toContain('/security')
        ->toContain('/privacy')
        ->toContain('/terms')
        ->toContain('/services')
        ->toContain('/pricing')
        ->toContain('/about')
        ->toContain('/contact');
});
