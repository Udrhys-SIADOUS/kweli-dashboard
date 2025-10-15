<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('type_id')->constrained('profile_types')->onUpdate('cascade')->onDelete('restrict');
            $table->json('datas')->nullable();
            $table->boolean('show_personal_datas')->default(false);
            $table->foreignId('status_id')->default(1)->constrained('user_status')->onUpdate('cascade')->onDelete('restrict');
            $table->boolean('is_certified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
