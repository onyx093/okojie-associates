<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('receipt_number', 32)->nullable()->unique()->after('stripe_session_id');
            $table->string('payment_method_brand', 32)->nullable()->after('receipt_number');
            $table->string('payment_method_last4', 4)->nullable()->after('payment_method_brand');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropUnique(['receipt_number']);
            $table->dropColumn(['receipt_number', 'payment_method_brand', 'payment_method_last4']);
        });
    }
};
