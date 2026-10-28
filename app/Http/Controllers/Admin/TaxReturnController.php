<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\AdvanceReturnStatus;
use App\Enums\ReturnStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReturnSummaryRequest;
use App\Models\AuditLog;
use App\Models\TaxReturn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class TaxReturnController extends Controller
{
    /**
     * Advance or reverse return status using AdvanceReturnStatus action.
     */
    public function updateStatus(
        Request $request,
        TaxReturn $taxReturn,
        AdvanceReturnStatus $action,
    ): RedirectResponse {
        Gate::authorize('update', $taxReturn);

        $validated = $request->validate([
            'status' => ['required', Rule::enum(ReturnStatus::class)],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $toStatus = ReturnStatus::from($validated['status']);

        $updatedReturn = $action->execute(
            taxReturn: $taxReturn,
            toStatus: $toStatus,
            byUser: $request->user(),
            reason: $validated['reason'] ?? null,
        );

        return back()->with('success', "Return status updated to {$updatedReturn->status->label()}.");
    }

    /**
     * Save the prepared return summary (allowed while status < e_signed).
     */
    public function updateSummary(
        UpdateReturnSummaryRequest $request,
        TaxReturn $taxReturn,
    ): RedirectResponse {
        Gate::authorize('update', $taxReturn);

        abort_if(
            $taxReturn->status->order() >= ReturnStatus::ESigned->order(),
            403,
            'Return summary cannot be modified after the return has been e-signed.',
        );

        /** @var array{
         *     federal: array{result: string, amount_cents: int|string},
         *     state?: array{code: string, result: string, amount_cents: int|string}|null,
         *     bank_last4?: string|null,
         *     filing_status: string,
         *     filing_method: string,
         *     forms?: list<array{name: string, pages: int|string, document_id?: string|null}>|null
         * } $validated
         */
        $validated = $request->validated();

        $summary = [
            'federal' => [
                'result' => (string) $validated['federal']['result'],
                'amount_cents' => (int) $validated['federal']['amount_cents'],
            ],
            'state' => isset($validated['state']) ? [
                'code' => (string) $validated['state']['code'],
                'result' => (string) $validated['state']['result'],
                'amount_cents' => (int) $validated['state']['amount_cents'],
            ] : null,
            'bank_last4' => $validated['bank_last4'] ?? null,
            'filing_status' => (string) $validated['filing_status'],
            'filing_method' => (string) $validated['filing_method'],
            'forms' => array_map(static fn (array $form): array => [
                'name' => (string) $form['name'],
                'pages' => (int) $form['pages'],
                'document_id' => $form['document_id'] ?? null,
            ], $validated['forms'] ?? []),
        ];

        $taxReturn->update([
            'return_summary' => $summary,
        ]);

        AuditLog::record(
            action: 'admin.return_summary_updated',
            entity: 'TaxReturn',
            meta: [
                'tax_year' => $taxReturn->tax_year,
                'filing_status' => $summary['filing_status'],
                'federal_result' => $summary['federal']['result'],
                'federal_amount_cents' => $summary['federal']['amount_cents'],
                'state_code' => $summary['state']['code'] ?? null,
                'forms_count' => count($summary['forms']),
            ],
            entityId: $taxReturn->id,
        );

        return back()->with('success', 'Return summary updated.');
    }
}
