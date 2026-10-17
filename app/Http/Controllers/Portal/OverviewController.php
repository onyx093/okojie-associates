<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
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
        return Inertia::render('portal/overview');
    }
}
