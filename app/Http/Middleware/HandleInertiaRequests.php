<?php

namespace App\Http\Middleware;

use App\Enums\LeadStatus;
use App\Enums\Role;
use App\Models\Document;
use App\Models\Lead;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Inertia\Middleware;
use Spatie\Honeypot\Honeypot;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $role = $user?->role;
        $tier = $user?->tier;

        $roleValue = $role ? $role->value : 'client';
        $tierValue = $tier?->value;
        $tierLabel = $tier?->label();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'site' => config('site'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $roleValue,
                    'tier' => $tierValue,
                    'tierLabel' => $tierLabel,
                    'twoFactorEnabled' => ! is_null($user->two_factor_confirmed_at),
                    'title' => $user->title,
                    'office' => $user->office,
                    'officeLabel' => $user->officeLabel(),
                    'avatarUrl' => $user->avatarUrl(),
                    'preferences' => [
                        'compactTables' => (bool) $user->compact_tables,
                        'reduceMotion' => (bool) $user->reduce_motion,
                    ],
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'navCounts' => fn (): ?array => $this->resolveNavCounts($request),
            'honeypot' => fn (): ?array => $this->resolveHoneypot(),
            'cspNonce' => fn () => Vite::cspNonce(),
            // Public forms send these back so ProtectAgainstSpam doesn't reject real visitors.
            'honeypot' => function () {
                $honeypot = app(Honeypot::class);

                return [
                    'nameField' => $honeypot->nameFieldName(),
                    'validFromField' => $honeypot->validFromFieldName(),
                    'validFrom' => $honeypot->encryptedValidFrom(),
                ];
            },
        ];
    }

    /**
     * Resolve the shared Spatie Honeypot configuration and encrypted timestamp token.
     *
     * @return array{name: string, validFromName: string, validFrom: string}|null
     */
    private function resolveHoneypot(): ?array
    {
        if (! config('honeypot.enabled')) {
            return null;
        }

        /** @var array<string, mixed> $config */
        $config = config('honeypot', []);
        $honeypot = new Honeypot($config);

        return [
            'name' => (string) config('honeypot.name_field_name'),
            'validFromName' => (string) config('honeypot.valid_from_field_name'),
            'validFrom' => $honeypot->encryptedValidFrom(),
        ];
    }

    /**
     * Resolve navigation badge counts lazily by authenticated user role.
     *
     * @return array{documents: int, unreadMessages: int}|array{clients: int, newLeads: int}|null
     */
    private function resolveNavCounts(Request $request): ?array
    {
        $user = $request->user();

        if (! $user instanceof User) {
            return null;
        }

        if ($user->role === Role::Admin) {
            return [
                'clients' => User::query()->where('role', Role::Client)->count(),
                'newLeads' => Lead::query()->where('status', LeadStatus::New)->count(),
            ];
        }

        if ($user->role === Role::Preparer) {
            return [
                'clients' => User::query()
                    ->where('role', Role::Client)
                    ->whereHas('taxReturns', fn ($query) => $query->where('preparer_id', $user->id))
                    ->count(),
                'newLeads' => Lead::query()->where('status', LeadStatus::New)->count(),
            ];
        }

        return [
            'documents' => Document::query()->where('user_id', $user->id)->count(),
            'unreadMessages' => Message::query()
                ->where('to_user_id', $user->id)
                ->whereNull('read_at')
                ->count(),
        ];
    }
}
