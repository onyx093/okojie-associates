<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('contact', [
            'offices' => config('site.offices', []),
            'tiers' => array_values(config('tiers', [])),
            'initialTier' => $request->query('tier'),
            'referralCode' => $request->query('ref'),
        ]);
    }
}
