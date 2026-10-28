<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        /** @var array{years?: string, returns?: string, preparers?: string, offices?: string} $stats */
        $stats = config('site.stats', []);

        return Inertia::render('about', [
            'stats' => [
                ['value' => $stats['years'] ?? '26+', 'label' => 'Years serving PA & MD taxpayers'],
                ['value' => $stats['returns'] ?? '40,000+', 'label' => 'Returns prepared and filed'],
                ['value' => $stats['preparers'] ?? '12', 'label' => 'Credentialed preparers'],
                ['value' => $stats['offices'] ?? '4', 'label' => 'Offices across Philadelphia & Baltimore'],
            ],
            'offices' => config('site.offices', []),
        ]);
    }
}
