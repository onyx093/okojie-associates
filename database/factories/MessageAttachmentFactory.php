<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\MessageAttachment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MessageAttachment>
 */
class MessageAttachmentFactory extends Factory
{
    protected $model = MessageAttachment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message_id' => Message::factory(),
            'filename' => fake()->word().'.pdf',
            'mime' => 'application/pdf',
            'size_bytes' => fake()->numberBetween(1024, 512000),
            'storage_key' => 'message-attachments/'.fake()->uuid().'.pdf',
        ];
    }
}
