<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('services', [
            'tiers' => array_values(config('tiers', [])),
            'addons' => config('addons', []),
            'faqs' => config('faqs', []),
        ]);
    }
}
