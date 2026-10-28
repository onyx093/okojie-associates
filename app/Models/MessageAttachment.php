<?php

namespace App\Models;

use Carbon\CarbonInterface as Carbon;
use Database\Factories\MessageAttachmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $message_id
 * @property string $filename
 * @property string $mime
 * @property int $size_bytes
 * @property string $storage_key
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['message_id', 'filename', 'mime', 'size_bytes', 'storage_key'])]
#[Hidden(['storage_key'])]
class MessageAttachment extends Model
{
    /** @use HasFactory<MessageAttachmentFactory> */
    use HasFactory, HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Message, $this>
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Format the attachment size into human-readable units.
     */
    public function formattedSize(): string
    {
        if ($this->size_bytes >= 1048576) {
            return number_format($this->size_bytes / 1048576, 1).' MB';
        }

        if ($this->size_bytes >= 1024) {
            return number_format($this->size_bytes / 1024, 0).' KB';
        }

        return $this->size_bytes.' B';
    }
}
