<?php

test('styleguide renders successfully in local environment', function () {
    $response = $this->get(route('dev.styleguide'));

    $response->assertOk();
});

test('welcome marketing page renders successfully', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});
