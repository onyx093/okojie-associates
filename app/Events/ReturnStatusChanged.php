<?php

namespace App\Events;

use App\Enums\ReturnStatus;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReturnStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public TaxReturn $taxReturn,
        public ReturnStatus $from,
        public ReturnStatus $to,
        public User $byUser,
        public ?string $reason = null,
    ) {}
}
