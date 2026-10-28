<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('profile page is displayed', function () {
    $user = User::factory()->create([
        'title' => 'Enrolled Agent',
        'office' => 'germantown-ave',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('settings/profile')
        ->has('offices', 4)
        ->where('offices.0', [
            'slug' => 'germantown-ave',
            'label' => '5601 Germantown Ave, Philadelphia',
        ])
        ->where('auth.user.title', 'Enrolled Agent')
        ->where('auth.user.office', 'germantown-ave')
        ->where('auth.user.officeLabel', '5601 Germantown Ave, Philadelphia')
        ->where('auth.user.avatarUrl', null)
    );
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});

test('profile title and office can be updated and invalid values are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Adaeze Okojie',
            'email' => $user->email,
            'title' => 'Senior Tax Preparer, EA',
            'office' => 'liberty-heights-baltimore',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    expect($user->title)->toBe('Senior Tax Preparer, EA')
        ->and($user->office)->toBe('liberty-heights-baltimore')
        ->and($user->officeLabel())->toBe('4100 Liberty Heights Ave, Baltimore');

    // Invalid office slug and title > 120 chars are rejected
    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Adaeze Okojie',
            'email' => $user->email,
            'title' => str_repeat('a', 121),
            'office' => 'unknown-office',
        ])
        ->assertSessionHasErrors(['title', 'office']);
});

test('user can upload, replace, and remove their avatar photo', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    // Upload initial avatar
    $firstFile = UploadedFile::fake()->image('avatar-1.png', 200, 200);

    $this->actingAs($user)
        ->post(route('profile.avatar.store'), [
            'avatar' => $firstFile,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    $firstPath = $user->avatar_path;
    expect($firstPath)->not->toBeNull()
        ->and($user->avatarUrl())->toContain('/storage/avatars/');
    Storage::disk('public')->assertExists((string) $firstPath);

    // Replace avatar: old file is deleted and new file is stored
    $secondFile = UploadedFile::fake()->image('avatar-2.webp', 200, 200);

    $this->actingAs($user)
        ->post(route('profile.avatar.store'), [
            'avatar' => $secondFile,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    $secondPath = $user->avatar_path;
    expect($secondPath)->not->toBeNull()
        ->and($secondPath)->not->toBe($firstPath);
    Storage::disk('public')->assertMissing((string) $firstPath);
    Storage::disk('public')->assertExists((string) $secondPath);

    // Remove avatar: file is deleted and avatar_path is null
    $this->actingAs($user)
        ->delete(route('profile.avatar.destroy'))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    expect($user->avatar_path)->toBeNull()
        ->and($user->avatarUrl())->toBeNull();
    Storage::disk('public')->assertMissing((string) $secondPath);
});

test('avatar upload rejects oversized or unsupported file types', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    // Oversized image (> 2048 KB)
    $oversized = UploadedFile::fake()->image('huge.jpg')->size(2500);
    $this->actingAs($user)
        ->post(route('profile.avatar.store'), ['avatar' => $oversized])
        ->assertSessionHasErrors('avatar');

    // Non-image PDF
    $pdf = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');
    $this->actingAs($user)
        ->post(route('profile.avatar.store'), ['avatar' => $pdf])
        ->assertSessionHasErrors('avatar');

    expect($user->fresh()->avatar_path)->toBeNull();
});
