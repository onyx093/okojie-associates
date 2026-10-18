<?php

namespace App\Providers;

use App\Events\ReturnStatusChanged;
use App\Listeners\HandleCashierWebhookReceived;
use App\Listeners\SendReturnStatusUpdatedNotification;
use App\Models\Appointment;
use App\Models\Document;
use App\Models\Referral;
use App\Models\TaxReturn;
use App\Models\User;
use App\Policies\AppointmentPolicy;
use App\Policies\DocumentPolicy;
use App\Policies\ReferralPolicy;
use App\Policies\TaxReturnPolicy;
use App\Policies\UserPolicy;
use App\Services\VirusScanner\ClamAvScanner;
use App\Services\VirusScanner\FakeScanner;
use App\Services\VirusScanner\ScannerInterface;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Cashier\Events\WebhookReceived;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ScannerInterface::class, function () {
            if (app()->isProduction() && config('services.clamav.enabled', false)) {
                return new ClamAvScanner;
            }

            return new FakeScanner;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('access-admin', fn (User $user): bool => $user->isStaff());

        Gate::policy(Appointment::class, AppointmentPolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(Referral::class, ReferralPolicy::class);
        Gate::policy(TaxReturn::class, TaxReturnPolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        Event::listen(
            ReturnStatusChanged::class,
            SendReturnStatusUpdatedNotification::class,
        );

        Event::listen(
            WebhookReceived::class,
            HandleCashierWebhookReceived::class,
        );

        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        Model::shouldBeStrict(! app()->isProduction());

        RateLimiter::for('public-forms', fn (Request $request) => Limit::perHour(5)->by($request->ip()));

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
