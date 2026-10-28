<?php

namespace App\Http\Requests\Admin;

use App\Enums\ReturnStatus;
use App\Models\TaxReturn;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReturnSummaryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var TaxReturn|null $taxReturn */
        $taxReturn = $this->route('taxReturn');

        if (! $taxReturn instanceof TaxReturn) {
            return false;
        }

        if (($this->user()?->cannot('update', $taxReturn)) ?? true) {
            return false;
        }

        return $taxReturn->status->order() < ReturnStatus::ESigned->order();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var TaxReturn $taxReturn */
        $taxReturn = $this->route('taxReturn');

        return [
            'federal' => ['required', 'array'],
            'federal.result' => ['required', 'string', Rule::in(TaxReturn::SUMMARY_RESULTS)],
            'federal.amount_cents' => ['required', 'integer', 'min:0', 'max:1000000000'],
            'state' => ['nullable', 'array'],
            'state.code' => ['required_with:state', 'string', Rule::in(array_keys(TaxReturn::SUMMARY_STATES))],
            'state.result' => ['required_with:state', 'string', Rule::in(TaxReturn::SUMMARY_RESULTS)],
            'state.amount_cents' => ['required_with:state', 'integer', 'min:0', 'max:1000000000'],
            'bank_last4' => ['nullable', 'string', 'regex:/^\d{4}$/'],
            'filing_status' => ['required', 'string', Rule::in(array_keys(TaxReturn::FILING_STATUSES))],
            'filing_method' => ['required', 'string', Rule::in(array_keys(TaxReturn::FILING_METHODS))],
            'forms' => ['nullable', 'array', 'max:12'],
            'forms.*.name' => ['required', 'string', 'max:200'],
            'forms.*.pages' => ['required', 'integer', 'min:1', 'max:1000'],
            'forms.*.document_id' => [
                'nullable',
                'string',
                Rule::exists('documents', 'id')->where('user_id', $taxReturn->user_id),
            ],
        ];
    }
}
