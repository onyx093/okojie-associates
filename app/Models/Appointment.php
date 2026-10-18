<?php

namespace App\Models;

use App\Enums\ApptFormat;
use App\Enums\ApptStatus;
use App\Enums\TimeWindow;
use Carbon\CarbonInterface as Carbon;
use Database\Factories\AppointmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property int $user_id
 * @property Carbon $preferred_date
 * @property TimeWindow $time_window
 * @property ApptFormat $format
 * @property string|null $topic
 * @property string|null $notes
 * @property ApptStatus $status
 * @property Carbon|null $confirmed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'preferred_date', 'time_window', 'format', 'topic', 'notes', 'status', 'confirmed_at'])]
class Appointment extends Model
{
    /** @use HasFactory<AppointmentFactory> */
    use HasFactory, HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'time_window' => TimeWindow::class,
            'format' => ApptFormat::class,
            'status' => ApptStatus::class,
            'confirmed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
