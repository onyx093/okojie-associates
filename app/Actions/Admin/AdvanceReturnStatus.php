<?php

namespace App\Actions\Admin;

use App\Enums\ReturnStatus;
use App\Events\ReturnStatusChanged;
use App\Models\AuditLog;
use App\Models\StatusEvent;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AdvanceReturnStatus
{
    /**
     * Advance or reverse a tax return status.
     *
     * @throws ValidationException
     */
    public function execute(
        TaxReturn $taxReturn,
        ReturnStatus $toStatus,
        User $byUser,
        ?string $reason = null,
    ): TaxReturn {
        $fromStatus = $taxReturn->status;

        // Moving backward (reversing) strictly requires a reason
        if ($toStatus->order() < $fromStatus->order()) {
            $trimmedReason = trim((string) $reason);
            if ($trimmedReason === '') {
                throw ValidationException::withMessages([
                    'reason' => 'A reason is required when reversing return status.',
                ]);
            }
        }

        $taxReturn->status = $toStatus;

        if ($toStatus === ReturnStatus::ESigned && ! $taxReturn->signed_at) {
            $taxReturn->signed_at = now();
        }

        if ($toStatus === ReturnStatus::EFiled && ! $taxReturn->filed_at) {
            $taxReturn->filed_at = now();
        }

        $taxReturn->save();

        StatusEvent::create([
            'tax_return_id' => $taxReturn->id,
            'from' => $fromStatus,
            'to' => $toStatus,
            'by_user_id' => $byUser->id,
            'reason' => $reason,
        ]);

        AuditLog::record(
            action: 'tax_return.status_changed',
            entity: 'TaxReturn',
            meta: [
                'from' => $fromStatus->value,
                'to' => $toStatus->value,
                'reason' => $reason,
            ],
            entityId: $taxReturn->id,
            actorId: $byUser->id,
        );

        event(new ReturnStatusChanged($taxReturn, $fromStatus, $toStatus, $byUser, $reason));

        return $taxReturn->fresh(['statusEvents', 'user', 'preparer', 'invoice']);
    }
}
