<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $lastmod = now()->toAtomString();

        $urls = [
            [
                'loc' => route('home'),
                'lastmod' => $lastmod,
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
            [
                'loc' => route('services'),
                'lastmod' => $lastmod,
                'changefreq' => 'monthly',
                'priority' => '0.9',
            ],
            [
                'loc' => route('pricing'),
                'lastmod' => $lastmod,
                'changefreq' => 'monthly',
                'priority' => '0.9',
            ],
            [
                'loc' => route('about'),
                'lastmod' => $lastmod,
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ],
            [
                'loc' => route('contact'),
                'lastmod' => $lastmod,
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ],
            [
                'loc' => route('security'),
                'lastmod' => $lastmod,
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ],
            [
                'loc' => route('privacy'),
                'lastmod' => $lastmod,
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ],
            [
                'loc' => route('terms'),
                'lastmod' => $lastmod,
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ],
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= "    <url>\n";
            $xml .= '        <loc>'.htmlspecialchars($url['loc']).'</loc>'."\n";
            $xml .= '        <lastmod>'.$url['lastmod'].'</lastmod>'."\n";
            $xml .= '        <changefreq>'.$url['changefreq'].'</changefreq>'."\n";
            $xml .= '        <priority>'.$url['priority'].'</priority>'."\n";
            $xml .= "    </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
