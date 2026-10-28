<?php

namespace App\Http\Controllers\Portal;

use App\Enums\ApptStatus;
use App\Enums\ReturnStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\TaxReturnResource;
use App\Models\StatusEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OverviewController extends Controller
{
    /**
     * Display the client portal overview.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $taxReturn = $user->taxReturns()
            ->with([
                'invoice',
                'statusEvents' => fn ($query) => $query->oldest('created_at')->orderBy('id'),
            ])
            ->latest('tax_year')
            ->first();

        $invoice = $taxReturn?->invoice;

        $counts = [
            'documents' => $user->documents()->count(),
            'referrals' => $user->referrals()->count(),
        ];

        $unreadMessages = $user->receivedMessages()
            ->whereNull('read_at')
            ->count();

        $nextAppointment = $user->appointments()
            ->whereIn('status', [ApptStatus::Requested, ApptStatus::Confirmed])
            ->whereDate('preferred_date', '>=', now()->toDateString())
            ->orderBy('preferred_date')
            ->orderBy('created_at')
            ->first();

        $recentDocuments = $user->documents()
            ->latest('created_at')
            ->orderByDesc('id')
            ->limit(3)
            ->get();

        /** @var array<string, string|null> $stageDates */
        $stageDates = [];
        foreach (ReturnStatus::cases() as $status) {
            if ($status === ReturnStatus::IntakeReceived) {
                $stageDates[$status->value] = $taxReturn?->created_at?->toIso8601String();

                continue;
            }

            $firstEvent = $taxReturn?->statusEvents
                ->first(fn (StatusEvent $event): bool => $event->to === $status);

            $stageDates[$status->value] = $firstEvent?->created_at?->toIso8601String();
        }

        return Inertia::render('portal/overview', [
            'taxReturn' => $taxReturn ? new TaxReturnResource($taxReturn) : null,
            'invoice' => $invoice ? new InvoiceResource($invoice) : null,
            'counts' => $counts,
            'unreadMessages' => $unreadMessages,
            'nextAppointment' => $nextAppointment ? (new AppointmentResource($nextAppointment))->resolve() : null,
            'recentDocuments' => DocumentResource::collection($recentDocuments)->resolve(),
            'stageDates' => $stageDates,
        ]);
    }
}
