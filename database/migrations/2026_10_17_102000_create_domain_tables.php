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
        Schema::create('tax_returns', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('tax_year');
            $table->string('tier')->nullable();
            $table->string('status')->default('intake_received');
            $table->foreignId('preparer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('signed_at')->nullable();
            $table->timestamp('filed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'tax_year']);
        });

        Schema::create('status_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tax_return_id')->constrained('tax_returns')->cascadeOnDelete();
            $table->string('from')->nullable();
            $table->string('to');
            $table->foreignId('by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tax_return_id')->unique()->constrained('tax_returns')->cascadeOnDelete();
            $table->integer('amount_cents')->nullable();
            $table->string('currency', 3)->default('usd');
            $table->string('status')->default('draft');
            $table->string('stripe_session_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUlid('tax_return_id')->nullable()->constrained('tax_returns')->nullOnDelete();
            $table->string('type')->default('w2');
            $table->string('filename');
            $table->string('mime');
            $table->unsignedBigInteger('size_bytes');
            $table->string('storage_key');
            $table->string('scan_status')->default('clean');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('preferred_date');
            $table->string('time_window')->default('morning');
            $table->string('format')->default('video');
            $table->string('topic', 120)->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('requested');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('to_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('from_user_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('referrals', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('referrer_id')->constrained('users')->cascadeOnDelete();
            $table->string('friend_name');
            $table->string('friend_email');
            $table->string('status')->default('sent');
            $table->integer('reward_cents')->nullable();
            $table->string('source')->default('email');
            $table->foreignId('friend_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['referrer_id', 'friend_email']);
        });

        Schema::create('leads', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('kind');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email');
            $table->string('tier_interest')->nullable();
            $table->text('situation')->nullable();
            $table->date('preferred_date')->nullable();
            $table->string('time_window')->nullable();
            $table->string('format')->nullable();
            $table->text('notes')->nullable();
            $table->string('ref_code')->nullable();
            $table->string('status')->default('new');
            $table->timestamps();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('email')->unique();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');
            $table->string('entity')->nullable();
            $table->string('entity_id')->nullable();
            $table->json('meta')->nullable();
            $table->string('ip', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('referrals');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('status_events');
        Schema::dropIfExists('tax_returns');
    }
};
