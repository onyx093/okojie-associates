<?php

namespace App\Models;

use App\Enums\Role;
use App\Enums\Tier;
use Carbon\CarbonInterface as Carbon;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Cashier\Billable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string|null $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $title
 * @property string|null $office
 * @property string|null $avatar_path
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property Carbon|null $password_changed_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Role $role
 * @property Tier|null $tier
 * @property string|null $referral_code
 * @property string|null $referred_by_code
 * @property bool $compact_tables
 * @property bool $reduce_motion
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property Carbon|null $trial_ends_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'phone', 'title', 'office', 'avatar_path', 'password', 'password_changed_at', 'role', 'tier', 'referral_code', 'referred_by_code', 'compact_tables', 'reduce_motion'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use Billable, HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_changed_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'role' => Role::class,
            'tier' => Tier::class,
            'compact_tables' => 'boolean',
            'reduce_motion' => 'boolean',
        ];
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (User $user): void {
            if (empty($user->referral_code)) {
                $user->referral_code = self::generateReferralCode();
            }
        });
    }

    /**
     * Generate a unique referral code.
     */
    public static function generateReferralCode(): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        do {
            $code = 'OKJ-';
            for ($i = 0; $i < 6; $i++) {
                $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }
        } while (static::where('referral_code', $code)->exists());

        return $code;
    }

    /**
     * @return HasMany<TaxReturn, $this>
     */
    public function taxReturns(): HasMany
    {
        return $this->hasMany(TaxReturn::class);
    }

    /**
     * @return HasMany<Document, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * @return HasMany<Appointment, $this>
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * @return HasMany<Message, $this>
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'from_user_id');
    }

    /**
     * @return HasMany<Message, $this>
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'to_user_id');
    }

    /**
     * @return HasMany<Referral, $this>
     */
    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function referredBy(): BelongsTo
    {
        return $this->belongsTo(self::class, 'referred_by_code', 'referral_code');
    }

    /**
     * Determine if the user is a staff member (Admin or Preparer).
     */
    public function isStaff(): bool
    {
        return $this->role === Role::Admin || $this->role === Role::Preparer;
    }

    /**
     * Get the configured office options with slug and label.
     *
     * @return list<array{slug: string, label: string}>
     */
    public static function officeOptions(): array
    {
        /** @var array<int, array{slug?: string, city?: string, address?: string}> $offices */
        $offices = config('site.offices', []);

        $options = [];
        foreach ($offices as $office) {
            $slug = (string) ($office['slug'] ?? '');
            if ($slug === '') {
                continue;
            }

            $address = (string) ($office['address'] ?? '');
            $city = explode(',', (string) ($office['city'] ?? ''))[0];

            $options[] = [
                'slug' => $slug,
                'label' => trim("{$address}, {$city}", ', '),
            ];
        }

        return $options;
    }

    /**
     * Resolve the human-readable office label for the user's selected office slug.
     */
    public function officeLabel(): ?string
    {
        if (! $this->office) {
            return null;
        }

        foreach (self::officeOptions() as $option) {
            if ($option['slug'] === $this->office) {
                return $option['label'];
            }
        }

        return null;
    }

    /**
     * Resolve the public URL for the user's avatar image, if present.
     */
    public function avatarUrl(): ?string
    {
        if (! $this->avatar_path) {
            return null;
        }

        return Storage::disk('public')->url($this->avatar_path);
    }
}
