<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('home', [
            // The homepage supports light and dark; the rest of the site is dark-only.
            'theme' => $request->cookie('appearance') === 'light' ? 'light' : 'dark',
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
