<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\Portal\OverviewController;
use App\Http\Controllers\Portal\TierController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Honeypot\ProtectAgainstSpam;

Route::get('/', HomeController::class)->name('home');
Route::get('/services', ServicesController::class)->name('services');
Route::get('/pricing', PricingController::class)->name('pricing');
Route::get('/about', AboutController::class)->name('about');
Route::get('/contact', ContactController::class)->name('contact');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::middleware(['throttle:public-forms', ProtectAgainstSpam::class])->group(function () {
    Route::post('/leads/quote', [LeadController::class, 'quote'])->name('leads.quote');
    Route::post('/leads/consult', [LeadController::class, 'consult'])->name('leads.consult');
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'store'])->name('newsletter.subscribe');
});

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
