<?php

namespace App\Models;

use App\Enums\ReferralStatus;
use App\Enums\ReturnStatus;
use App\Enums\Tier;
use Carbon\CarbonInterface as Carbon;
use Database\Factories\TaxReturnFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property string $id
 * @property int $user_id
 * @property int $tax_year
 * @property Tier|null $tier
 * @property ReturnStatus $status
 * @property int|null $preparer_id
 * @property Carbon|null $signed_at
 * @property Carbon|null $filed_at
 * @property array{
 *     federal: array{result: 'refund'|'owed'|'even', amount_cents: int},
 *     state: array{code: 'PA'|'MD'|'NJ'|'DE', result: 'refund'|'owed'|'even', amount_cents: int}|null,
 *     bank_last4: string|null,
 *     filing_status: 'single'|'married_joint'|'married_separate'|'head_of_household'|'qualifying_surviving_spouse',
 *     filing_method: 'e-file',
 *     forms: list<array{name: string, pages: int, document_id: string|null}>
 * }|null $return_summary Only the last 4 digits of a bank account (`bank_last4`) are ever stored.
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User|null $preparer
 * @property User $user
 * @property Invoice|null $invoice
 */
#[Fillable(['user_id', 'tax_year', 'tier', 'status', 'preparer_id', 'signed_at', 'filed_at', 'return_summary'])]
class TaxReturn extends Model
{
    /** @use HasFactory<TaxReturnFactory> */
    use HasFactory, HasUlids;

    /** @var list<string> */
    public const array SUMMARY_RESULTS = ['refund', 'owed', 'even'];

    /** @var array<string, string> */
    public const array SUMMARY_RESULT_LABELS = [
        'refund' => 'Refund',
        'owed' => 'Amount owed',
        'even' => 'Even ($0)',
    ];

    /** @var array<string, string> */
    public const array SUMMARY_STATES = [
        'PA' => 'Pennsylvania',
        'MD' => 'Maryland',
        'NJ' => 'New Jersey',
        'DE' => 'Delaware',
    ];

    /** @var array<string, string> */
    public const array FILING_STATUSES = [
        'single' => 'Single',
        'married_joint' => 'Married filing jointly',
        'married_separate' => 'Married filing separately',
        'head_of_household' => 'Head of household',
        'qualifying_surviving_spouse' => 'Qualifying surviving spouse',
    ];

    /** @var array<string, string> */
    public const array FILING_METHODS = [
        'e-file' => 'IRS e-file',
    ];

    protected static function booted(): void
    {
        static::updated(function (TaxReturn $return) {
            if ($return->wasChanged('status') && $return->status === ReturnStatus::EFiled) {
                $user = $return->user;
                Referral::where(function ($query) use ($user) {
                    $query->where('friend_user_id', $user->id)
                        ->orWhere('friend_email', strtolower($user->email));
                })
                    ->where('status', '!=', ReferralStatus::Rewarded)
                    ->update(['status' => ReferralStatus::Filed]);
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tax_year' => 'integer',
            'tier' => Tier::class,
            'status' => ReturnStatus::class,
            'signed_at' => 'datetime',
            'filed_at' => 'datetime',
            'return_summary' => 'array',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function preparer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'preparer_id');
    }

    /**
     * @return HasMany<StatusEvent, $this>
     */
    public function statusEvents(): HasMany
    {
        return $this->hasMany(StatusEvent::class);
    }

    /**
     * @return HasOne<Invoice, $this>
     */
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    /**
     * @return HasMany<Document, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Format the stored return summary for the portal sign page, or return null when absent.
     *
     * @return array{
     *     federal: array{result: string, result_label: string, amount_cents: int, amount_formatted: string},
     *     state: array{code: string, name: string, result: string, result_label: string, amount_cents: int, amount_formatted: string}|null,
     *     bank_last4: string|null,
     *     filing_status: string,
     *     filing_status_label: string,
     *     filing_method: string,
     *     filing_method_label: string,
     *     forms: list<array{name: string, pages: int, document_id: string|null, open_url: string|null}>
     * }|null
     */
    public function formattedReturnSummary(): ?array
    {
        $summary = $this->return_summary;

        if ($summary === null) {
            return null;
        }

        $rawForms = $summary['forms'];
        $requestedDocumentIds = array_values(array_filter(array_map(
            static fn (array $form): ?string => $form['document_id'] !== null && $form['document_id'] !== ''
                ? $form['document_id']
                : null,
            $rawForms,
        )));

        /** @var list<string> $ownedDocumentIds */
        $ownedDocumentIds = $requestedDocumentIds !== []
            ? Document::query()
                ->where('user_id', $this->user_id)
                ->whereIn('id', $requestedDocumentIds)
                ->pluck('id')
                ->all()
            : [];

        $ownedLookup = array_fill_keys($ownedDocumentIds, true);

        $forms = array_map(static function (array $form) use ($ownedLookup): array {
            $docId = $form['document_id'] !== null && $form['document_id'] !== ''
                ? $form['document_id']
                : null;
            $isOwned = $docId !== null && isset($ownedLookup[$docId]);

            return [
                'name' => $form['name'],
                'pages' => $form['pages'],
                'document_id' => $isOwned ? $docId : null,
                'open_url' => $isOwned ? route('portal.documents.download', $docId) : null,
            ];
        }, $rawForms);

        $federalResult = $summary['federal']['result'];
        $federalAmountCents = $summary['federal']['amount_cents'];

        $state = null;
        if ($summary['state'] !== null) {
            $stateCode = $summary['state']['code'];
            $stateResult = $summary['state']['result'];
            $stateAmountCents = $summary['state']['amount_cents'];

            $state = [
                'code' => $stateCode,
                'name' => self::SUMMARY_STATES[$stateCode],
                'result' => $stateResult,
                'result_label' => self::SUMMARY_RESULT_LABELS[$stateResult],
                'amount_cents' => $stateAmountCents,
                'amount_formatted' => self::formatCents($stateAmountCents),
            ];
        }

        $filingStatus = $summary['filing_status'];
        $filingMethod = $summary['filing_method'];

        return [
            'federal' => [
                'result' => $federalResult,
                'result_label' => self::SUMMARY_RESULT_LABELS[$federalResult],
                'amount_cents' => $federalAmountCents,
                'amount_formatted' => self::formatCents($federalAmountCents),
            ],
            'state' => $state,
            'bank_last4' => $summary['bank_last4'] !== null && $summary['bank_last4'] !== ''
                ? $summary['bank_last4']
                : null,
            'filing_status' => $filingStatus,
            'filing_status_label' => self::FILING_STATUSES[$filingStatus],
            'filing_method' => $filingMethod,
            'filing_method_label' => self::FILING_METHODS[$filingMethod],
            'forms' => $forms,
        ];
    }

    /**
     * Option lists for the admin return summary form.
     *
     * @return array{
     *     results: list<array{value: string, label: string}>,
     *     states: list<array{value: string, label: string}>,
     *     filingStatuses: list<array{value: string, label: string}>,
     *     filingMethods: list<array{value: string, label: string}>
     * }
     */
    public static function summaryOptionLists(): array
    {
        return [
            'results' => array_map(
                static fn (string $value, string $label): array => ['value' => $value, 'label' => $label],
                array_keys(self::SUMMARY_RESULT_LABELS),
                array_values(self::SUMMARY_RESULT_LABELS),
            ),
            'states' => array_map(
                static fn (string $value, string $label): array => ['value' => $value, 'label' => $label],
                array_keys(self::SUMMARY_STATES),
                array_values(self::SUMMARY_STATES),
            ),
            'filingStatuses' => array_map(
                static fn (string $value, string $label): array => ['value' => $value, 'label' => $label],
                array_keys(self::FILING_STATUSES),
                array_values(self::FILING_STATUSES),
            ),
            'filingMethods' => array_map(
                static fn (string $value, string $label): array => ['value' => $value, 'label' => $label],
                array_keys(self::FILING_METHODS),
                array_values(self::FILING_METHODS),
            ),
        ];
    }

    private static function formatCents(int $amountCents): string
    {
        $decimals = $amountCents % 100 === 0 ? 0 : 2;

        return '$'.number_format($amountCents / 100, $decimals);
    }
}
