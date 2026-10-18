<?php

namespace App\Models;

use Carbon\CarbonInterface as Carbon;
use Database\Factories\AuditLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property int|null $actor_id
 * @property string $action
 * @property string|null $entity
 * @property string|null $entity_id
 * @property array<string, mixed>|null $meta
 * @property string|null $ip
 * @property Carbon $created_at
 */
#[Fillable(['actor_id', 'action', 'entity', 'entity_id', 'meta', 'ip'])]
class AuditLog extends Model
{
    /** @use HasFactory<AuditLogFactory> */
    use HasFactory, HasUlids;

    public const UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    /**
     * Helper to record an audit log entry.
     *
     * @param  array<string, mixed>  $meta
     */
    public static function record(
        string $action,
        ?string $entity = null,
        array $meta = [],
        ?string $entityId = null,
        ?int $actorId = null,
        ?string $ip = null,
    ): self {
        return self::create([
            'actor_id' => $actorId ?? auth()->id(),
            'action' => $action,
            'entity' => $entity,
            'entity_id' => $entityId,
            'meta' => $meta,
            'ip' => $ip ?? request()->ip(),
        ]);
    }
}
