<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\Portal\AppointmentController;
use App\Http\Controllers\Portal\DocumentController;
use App\Http\Controllers\Portal\OverviewController;
use App\Http\Controllers\Portal\SecurityController as PortalSecurityController;
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

Route::redirect('portal', '/portal/overview')->name('portal');

Route::middleware(['auth', 'verified', 'portal.2fa'])->prefix('portal')->name('portal.')->group(function () {
    Route::get('overview', [OverviewController::class, 'index'])->name('overview');
    Route::patch('tier', [TierController::class, 'update'])->name('tier.update');
    Route::get('security', [PortalSecurityController::class, 'index'])->name('security');

    // Documents
    Route::get('documents', [DocumentController::class, 'index'])->name('documents');
    Route::post('documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Appointments
    Route::get('appointments', [AppointmentController::class, 'index'])->name('appointments');
    Route::post('appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])->name('appointments.destroy');

    // Tab routes (stubs for subsequent steps)
    Route::get('referrals', fn () => redirect()->route('portal.overview'))->name('referrals');
    Route::get('messages', fn () => redirect()->route('portal.overview'))->name('messages');
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
