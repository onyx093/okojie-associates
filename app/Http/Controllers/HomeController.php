<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('home', [
            'tiers' => array_values(config('tiers', [])),
            'steps' => config('steps', []),
            'testimonials' => config('testimonials', []),
            'videos' => config('videos', []),
            'offices' => config('site.offices', []),
            'faqs' => config('faqs', []),
            'stats' => [
                ['value' => '26+', 'label' => 'Years in business'],
                ['value' => '40,000+', 'label' => 'Returns filed'],
                ['value' => '12', 'label' => 'Credentialed preparers'],
                ['value' => '4', 'label' => 'Offices in PA & MD'],
            ],
        ]);
    }
}
