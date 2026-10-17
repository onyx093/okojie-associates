<?php

namespace Database\Factories;

use App\Enums\DocType;
use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tax_return_id' => null,
            'type' => DocType::W2,
            'filename' => 'w2_2024.pdf',
            'mime' => 'application/pdf',
            'size_bytes' => 102400,
            'storage_key' => 'documents/'.Str::random(40).'.pdf',
            'scan_status' => 'clean',
            'uploaded_by' => null,
        ];
    }
}
