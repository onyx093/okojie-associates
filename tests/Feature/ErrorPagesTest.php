<?php

use Inertia\Testing\AssertableInertia as Assert;

test('404 error renders themed inertia error page', function () {
    $response = $this->get('/non-existent-random-page-123');

    $response->assertStatus(404);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('error')
        ->where('status', 404)
    );
});
