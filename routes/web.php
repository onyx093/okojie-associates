<?php

use App\Http\Controllers\Portal\OverviewController;
use App\Http\Controllers\Portal\TierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::redirect('portal', '/portal/overview')->name('portal');
    Route::get('portal/overview', [OverviewController::class, 'index'])->name('portal.overview');
    Route::patch('portal/tier', [TierController::class, 'update'])->name('portal.tier.update');
});

if (app()->environment('local', 'testing')) {
    Route::get('dev/styleguide', function () {
        return Inertia::render('dev/styleguide', [
            'tiers' => array_values(config('tiers', [])),
            'addons' => config('addons', []),
            'faqs' => config('faqs', []),
            'testimonials' => config('testimonials', []),
            'videos' => config('videos', []),
            'steps' => config('steps', []),
            'offices' => config('site.offices', []),
        ]);
    })->name('dev.styleguide');
}

require __DIR__.'/settings.php';
