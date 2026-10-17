<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\TaxReturnResource;
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
            ->with('invoice')
            ->latest('tax_year')
            ->first();

        $invoice = $taxReturn?->invoice;

        $counts = [
            'documents' => $user->documents()->count(),
            'referrals' => $user->referrals()->count(),
        ];

        return Inertia::render('portal/overview', [
            'taxReturn' => $taxReturn ? new TaxReturnResource($taxReturn) : null,
            'invoice' => $invoice ? new InvoiceResource($invoice) : null,
            'counts' => $counts,
        ]);
    }
}
