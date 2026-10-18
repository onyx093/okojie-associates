<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\TaxReturnController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\Portal\AppointmentController;
use App\Http\Controllers\Portal\DocumentController;
use App\Http\Controllers\Portal\MessageController;
use App\Http\Controllers\Portal\OverviewController;
use App\Http\Controllers\Portal\ReferralController;
use App\Http\Controllers\Portal\SecurityController as PortalSecurityController;
use App\Http\Controllers\Portal\SignController;
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
Route::inertia('/security', 'legal/security')->name('security');
Route::inertia('/privacy', 'legal/privacy')->name('privacy');
Route::inertia('/terms', 'legal/terms')->name('terms');

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

    // Referrals
    Route::get('referrals', [ReferralController::class, 'index'])->name('referrals');
    Route::post('referrals', [ReferralController::class, 'store'])->name('referrals.store');

    // Messages
    Route::get('messages', [MessageController::class, 'index'])->name('messages');
    Route::post('messages/read', [MessageController::class, 'markRead'])->name('messages.read');

    // Invoices & Checkout
    Route::post('invoices/{invoice}/checkout', [App\Http\Controllers\Portal\InvoiceController::class, 'checkout'])->name('invoices.checkout');
    Route::get('invoices/{invoice}/receipt', [App\Http\Controllers\Portal\InvoiceController::class, 'receipt'])->name('invoices.receipt');

    // E-signature
    Route::get('sign/{taxReturn}', [SignController::class, 'show'])->name('sign');
    Route::post('sign/{taxReturn}', [SignController::class, 'sign'])->name('sign.submit');
});

Route::middleware(['auth', 'verified', 'portal.2fa', 'can:access-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::redirect('/', '/admin/clients')->name('index');

        // Leads inbox
        Route::get('leads', [App\Http\Controllers\Admin\LeadController::class, 'index'])->name('leads.index');
        Route::patch('leads/{lead}/status', [App\Http\Controllers\Admin\LeadController::class, 'updateStatus'])->name('leads.status');
        Route::patch('leads/{lead}/notes', [App\Http\Controllers\Admin\LeadController::class, 'updateNotes'])->name('leads.notes');
        Route::post('leads/{lead}/convert', [App\Http\Controllers\Admin\LeadController::class, 'convert'])->name('leads.convert');

        // Clients
        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
        Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
        Route::patch('clients/{client}/tier', [ClientController::class, 'updateTier'])->name('clients.tier');
        Route::patch('clients/{client}/preparer', [ClientController::class, 'assignPreparer'])->name('clients.preparer');

        // Tax return status & invoice
        Route::patch('tax-returns/{taxReturn}/status', [TaxReturnController::class, 'updateStatus'])->name('returns.status');
        Route::patch('tax-returns/{taxReturn}/invoice', [InvoiceController::class, 'update'])->name('invoices.update');

        // Appointments
        Route::patch('appointments/{appointment}/status', [App\Http\Controllers\Admin\AppointmentController::class, 'updateStatus'])->name('appointments.status');

        // Messages to client
        Route::post('clients/{client}/messages', [App\Http\Controllers\Admin\MessageController::class, 'store'])->name('clients.messages.store');

        // Referrals
        Route::get('referrals', [App\Http\Controllers\Admin\ReferralController::class, 'index'])->name('referrals.index');
        Route::post('referrals/{referral}/reward', [App\Http\Controllers\Admin\ReferralController::class, 'reward'])->name('referrals.reward');
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
