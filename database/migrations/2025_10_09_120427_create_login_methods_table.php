<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('login_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('type_id')->constrained('login_method_types')->onUpdate('cascade')->onDelete('restrict');
            $table->string('value');
            $table->string('password')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->unique(['type_id', 'value'], 'idx_login_unique');
            $table->index('user_id', 'idx_login_user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_methods');
    }
};
