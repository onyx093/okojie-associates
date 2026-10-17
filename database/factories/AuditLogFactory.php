<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    public function definition(): array
    {
        return [
            'actor_id' => User::factory(),
            'action' => 'user.login',
            'entity' => 'User',
            'entity_id' => null,
            'meta' => ['user_agent' => 'Mozilla/5.0'],
            'ip' => '127.0.0.1',
            'created_at' => now(),
        ];
    }
}
