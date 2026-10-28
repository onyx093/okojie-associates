<?php

it('renders the home page in light and dark mode without javascript or console errors', function () {
    visit('/')
        ->inLightMode()
        ->assertNoSmoke();

    visit('/')
        ->inDarkMode()
        ->assertNoSmoke();
});
