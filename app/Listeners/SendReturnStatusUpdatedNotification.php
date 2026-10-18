<?php

namespace App\Listeners;

use App\Events\ReturnStatusChanged;
use App\Notifications\ReturnStatusUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendReturnStatusUpdatedNotification implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(ReturnStatusChanged $event): void
    {
        $client = $event->taxReturn->user;

        if ($client) {
            $client->notify(new ReturnStatusUpdated($event->taxReturn, $event->to));
        }
    }
}
