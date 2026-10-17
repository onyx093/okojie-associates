<?php

namespace App\Http\Controllers\Portal;

use App\Enums\DocType;
use App\Enums\ScanStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Jobs\ScanDocument;
use App\Models\AuditLog;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    /**
     * Display a listing of the user's documents.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $documents = $user->documents()
            ->latest()
            ->get();

        $taxReturn = $user->taxReturns()
            ->latest('tax_year')
            ->first();

        $canDelete = $taxReturn ? $taxReturn->status->isBeforeReadyForReview() : true;

        return Inertia::render('portal/documents', [
            'documents' => DocumentResource::collection($documents)->resolve(),
            'canDelete' => $canDelete,
            'taxReturnStatus' => $taxReturn?->status->value,
        ]);
    }

    /**
     * Store a newly uploaded document.
     */
    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $user = $request->user();
        $file = $request->file('file');

        $path = Storage::disk('private')->putFile("documents/{$user->id}", $file);

        $taxReturn = $user->taxReturns()
            ->latest('tax_year')
            ->first();

        $document = Document::create([
            'user_id' => $user->id,
            'tax_return_id' => $taxReturn?->id,
            'type' => $request->enum('type', DocType::class),
            'filename' => $file->getClientOriginalName(),
            'mime' => $file->getMimeType() ?: 'application/octet-stream',
            'size_bytes' => $file->getSize(),
            'storage_key' => $path,
            'scan_status' => ScanStatus::Pending,
            'uploaded_by' => $user->id,
        ]);

        ScanDocument::dispatch($document);

        AuditLog::record(
            action: 'document.uploaded',
            entity: 'Document',
            meta: [
                'filename' => $document->filename,
                'size' => $document->size_bytes,
                'type' => $document->type->value,
            ],
            entityId: $document->id,
        );

        return back()->with('success', 'Document uploaded successfully.');
    }

    /**
     * Download the specified document.
     */
    public function download(Request $request, Document $document): RedirectResponse
    {
        Gate::authorize('download', $document);

        if ($document->scan_status !== ScanStatus::Clean) {
            abort(403, 'Document cannot be downloaded until virus scanning is complete.');
        }

        AuditLog::record(
            action: 'document.downloaded',
            entity: 'Document',
            meta: ['filename' => $document->filename],
            entityId: $document->id,
        );

        $url = Storage::disk('private')->temporaryUrl(
            $document->storage_key,
            now()->addSeconds(60),
            ['ResponseContentDisposition' => 'attachment; filename="'.addslashes($document->filename).'"']
        );

        return redirect()->away($url);
    }

    /**
     * Remove the specified document from storage.
     */
    public function destroy(Request $request, Document $document): RedirectResponse
    {
        Gate::authorize('delete', $document);

        Storage::disk('private')->delete($document->storage_key);

        $filename = $document->filename;
        $documentId = $document->id;

        $document->delete();

        AuditLog::record(
            action: 'document.deleted',
            entity: 'Document',
            meta: ['filename' => $filename],
            entityId: $documentId,
        );

        return back()->with('success', 'Document deleted successfully.');
    }
}
