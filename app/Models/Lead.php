<?php

namespace App\Models;

use App\Enums\ApptFormat;
use App\Enums\LeadKind;
use App\Enums\LeadStatus;
use App\Enums\TimeWindow;
use Carbon\CarbonInterface as Carbon;
use Database\Factories\LeadFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property LeadKind $kind
 * @property string $name
 * @property string|null $phone
 * @property string $email
 * @property string|null $tier_interest
 * @property string|null $situation
 * @property Carbon|null $preferred_date
 * @property TimeWindow|null $time_window
 * @property ApptFormat|null $format
 * @property string|null $notes
 * @property string|null $ref_code
 * @property LeadStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'kind',
    'name',
    'phone',
    'email',
    'tier_interest',
    'situation',
    'preferred_date',
    'time_window',
    'format',
    'notes',
    'ref_code',
    'status',
])]
class Lead extends Model
{
    /** @use HasFactory<LeadFactory> */
    use HasFactory, HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kind' => LeadKind::class,
            'status' => LeadStatus::class,
            'preferred_date' => 'date',
            'time_window' => TimeWindow::class,
            'format' => ApptFormat::class,
        ];
    }
}
