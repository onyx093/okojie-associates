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
        return Inertia::render('about', [
            'stats' => [
                ['value' => '26+', 'label' => 'Years serving PA & MD taxpayers'],
                ['value' => '40,000+', 'label' => 'Returns prepared and filed'],
                ['value' => '4', 'label' => 'Offices across Philadelphia & Baltimore'],
            ],
            'offices' => config('site.offices', []),
        ]);
    }
}
