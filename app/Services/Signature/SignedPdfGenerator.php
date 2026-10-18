<?php

namespace App\Services\Signature;

use App\Models\TaxReturn;
use App\Models\User;
use Carbon\CarbonInterface;

/**
 * Service to generate an audit-compliant signed PDF record.
 *
 * NOTE FOR COMPLIANCE:
 * Real IRS Form 8879 wording, PIN handling, and e-file rules (IRS Pub 1345)
 * must be reviewed and certified by qualified legal counsel and your Authorized IRS e-file Provider.
 */
class SignedPdfGenerator
{
    /**
     * Generate standard PDF 1.4 bytes representing the signed authorization.
     */
    public function generate(
        TaxReturn $taxReturn,
        User $user,
        string $typedSignature,
        CarbonInterface $timestamp,
        string $ip,
        string $userAgent,
    ): string {
        $taxYear = (string) $taxReturn->tax_year;
        $clientName = $this->sanitizeForPdf($user->name ?: $user->email);
        $signature = $this->sanitizeForPdf($typedSignature);
        $timeStr = $timestamp->toIso8601String();
        $ipStr = $this->sanitizeForPdf($ip);
        $uaStr = $this->sanitizeForPdf(substr($userAgent, 0, 80));
        $returnId = (string) $taxReturn->id;

        // Construct PDF content stream
        $textStream = "BT\n";
        $textStream .= "/F1 16 Tf\n";
        $textStream .= "50 730 Td\n";
        $textStream .= "(OKOJIE & ASSOCIATES, INC. - ELECTRONIC SIGNATURE RECORD) Tj\n";

        $textStream .= "/F1 10 Tf\n";
        $textStream .= "0 -25 Td\n";
        $textStream .= "(IRS Form 8879 E-File Authorization & Form 7216 Disclosure Consent) Tj\n";

        $textStream .= "/F1 9 Tf\n";
        $textStream .= "0 -35 Td\n";
        $textStream .= "(Tax Year: {$taxYear}) Tj\n";
        $textStream .= "0 -16 Td\n";
        $textStream .= "(Return ID: {$returnId}) Tj\n";
        $textStream .= "0 -16 Td\n";
        $textStream .= "(Taxpayer Name: {$clientName}) Tj\n";
        $textStream .= "0 -16 Td\n";
        $textStream .= "(Taxpayer Email: {$user->email}) Tj\n";

        $textStream .= "0 -30 Td\n";
        $textStream .= "(------------------------------------------------------------------------------------------------) Tj\n";

        $textStream .= "0 -25 Td\n";
        $textStream .= "(SIGNATURE & VERIFICATION METADATA) Tj\n";
        $textStream .= "0 -18 Td\n";
        $textStream .= "(Typed Signature: {$signature}) Tj\n";
        $textStream .= "0 -16 Td\n";
        $textStream .= "(Signed At: {$timeStr}) Tj\n";
        $textStream .= "0 -16 Td\n";
        $textStream .= "(IP Address: {$ipStr}) Tj\n";
        $textStream .= "0 -16 Td\n";
        $textStream .= "(User Agent: {$uaStr}) Tj\n";

        $textStream .= "0 -30 Td\n";
        $textStream .= "(------------------------------------------------------------------------------------------------) Tj\n";

        $textStream .= "0 -25 Td\n";
        $textStream .= "(STATUTORY DISCLOSURES & DECLARATION) Tj\n";
        $textStream .= "0 -18 Td\n";
        $textStream .= "(1. Form 7216 Disclosure Consent: The taxpayer acknowledged and provided affirmative consent) Tj\n";
        $textStream .= "0 -14 Td\n";
        $textStream .= "(   for the use and secure electronic transmission of tax return information.) Tj\n";
        $textStream .= "0 -18 Td\n";
        $textStream .= "(2. Form 8879 E-File Declaration: Under penalties of perjury, the taxpayer declared that they have) Tj\n";
        $textStream .= "0 -14 Td\n";
        $textStream .= "(   examined a copy of their return and accompanying schedules, and authorized electronic filing.) Tj\n";

        $textStream .= "0 -40 Td\n";
        $textStream .= '(Audit Trail Verification Fingerprint: '.hash('sha256', "{$returnId}|{$signature}|{$timeStr}|{$ipStr}").") Tj\n";
        $textStream .= "ET\n";

        $streamLength = strlen($textStream);

        // Build valid PDF-1.4 file structure
        $objects = [];
        $objects[1] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
        $objects[2] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
        $objects[3] = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n";
        $objects[4] = "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
        $objects[5] = "5 0 obj\n<< /Length {$streamLength} >>\nstream\n{$textStream}\nendstream\nendobj\n";

        $pdf = "%PDF-1.4\n";
        $offsets = [0 => 0];

        foreach ($objects as $num => $content) {
            $offsets[$num] = strlen($pdf);
            $pdf .= $content;
        }

        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n";
        $pdf .= '0 '.(count($objects) + 1)."\n";
        $pdf .= "0000000000 65535 f \n";

        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }

        $pdf .= "trailer\n";
        $pdf .= '<< /Size '.(count($objects) + 1)." /Root 1 0 R >>\n";
        $pdf .= "startxref\n";
        $pdf .= "{$xrefOffset}\n";
        $pdf .= "%%EOF\n";

        return $pdf;
    }

    /**
     * Escape parentheses and backslashes for PDF text literal syntax.
     */
    protected function sanitizeForPdf(string $text): string
    {
        $sanitized = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        return preg_replace('/[^\x20-\x7E]/', '', $sanitized) ?: '';
    }
}
