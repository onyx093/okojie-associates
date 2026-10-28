<?php

namespace App\Http\Resources;

use App\Models\TaxReturn;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TaxReturn
 */
class TaxReturnResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tax_year' => $this->tax_year,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'next_step_text' => $this->status->nextStepText(),
            'next_step' => $this->status->nextStep(),
            'tier' => $this->tier?->value,
            'signed_at' => $this->signed_at?->toIso8601String(),
            'filed_at' => $this->filed_at?->toIso8601String(),
        ];
    }
}
