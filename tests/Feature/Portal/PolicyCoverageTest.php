<?php

use App\Enums\DocType;
use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Models\Appointment;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;

test('policy coverage: every portal controller action with a model parameter must call authorize', function () {
    $controllerPath = app_path('Http/Controllers/Portal');
    $files = File::files($controllerPath);

    expect(count($files))->toBeGreaterThan(0);

    $missingAuthorization = [];

    foreach ($files as $file) {
        $className = 'App\\Http\\Controllers\\Portal\\'.pathinfo($file->getFilename(), PATHINFO_FILENAME);

        if (! class_exists($className)) {
            continue;
        }

        $reflection = new ReflectionClass($className);
        $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);

        foreach ($methods as $method) {
            // Only examine methods declared directly on the controller (not base Controller / parent)
            if ($method->getDeclaringClass()->getName() !== $className) {
                continue;
            }

            // Check if any parameter is an Eloquent Model or subclass
            $hasModelParam = false;
            foreach ($method->getParameters() as $param) {
                $type = $param->getType();
                if ($type instanceof ReflectionNamedType && ! $type->isBuiltin()) {
                    $paramClass = $type->getName();
                    if (is_subclass_of($paramClass, Model::class)) {
                        $hasModelParam = true;
                        break;
                    }
                }
            }

            if ($hasModelParam) {
                // Read method source code to assert authorize() or Gate::authorize() is invoked
                $filename = (string) $method->getFileName();
                $startLine = (int) $method->getStartLine();
                $endLine = (int) $method->getEndLine();
                $lines = array_slice(file($filename) ?: [], $startLine - 1, $endLine - $startLine + 1);
                $body = implode('', $lines);

                $callsAuthorize = str_contains($body, 'authorize(')
                    || str_contains($body, 'Gate::authorize(')
                    || str_contains($body, '$this->authorize(');

                if (! $callsAuthorize) {
                    $missingAuthorization[] = "{$className}@{$method->getName()}";
                }
            }
        }
    }

    expect($missingAuthorization)->toBeEmpty(
        'The following portal controller actions accept an Eloquent model but lack an authorize() call: '
        .implode(', ', $missingAuthorization)
    );
});

test('policy coverage: portal controller actions reject access to unauthorized resources with 403', function () {
    $owner = User::factory()->withTwoFactor()->create();
    $attacker = User::factory()->withTwoFactor()->create();

    // 1. Document download and delete
    $document = Document::factory()->create([
        'user_id' => $owner->id,
        'type' => DocType::W2,
        'filename' => 'w2.pdf',
        'mime' => 'application/pdf',
        'size_bytes' => 1024,
        'storage_key' => 'documents/w2.pdf',
    ]);

    $this->actingAs($attacker)->get(route('portal.documents.download', $document))->assertForbidden();
    $this->actingAs($attacker)->delete(route('portal.documents.destroy', $document))->assertForbidden();

    // 2. Appointment cancel
    $appointment = Appointment::factory()->create([
        'user_id' => $owner->id,
        'preferred_date' => now()->addDays(5),
    ]);

    $this->actingAs($attacker)->delete(route('portal.appointments.destroy', $appointment))->assertForbidden();

    // 3. Invoice checkout and receipt
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $owner->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::ReadyForReview,
    ]);
    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    $this->actingAs($attacker)->post(route('portal.invoices.checkout', $invoice))->assertForbidden();
    $this->actingAs($attacker)->get(route('portal.invoices.receipt', $invoice))->assertForbidden();

    // 4. TaxReturn sign
    $this->actingAs($attacker)->get(route('portal.sign', $taxReturn))->assertForbidden();
    $this->actingAs($attacker)->post(route('portal.sign.submit', $taxReturn), [
        'consent_7216' => true,
        'typed_signature' => 'Unauthorized Signer',
    ])->assertForbidden();
});
