<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        DB::table('profile_types')->insert([
            ['name' => 'personnel', 'description' => 'Profil personnel standard', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'entreprise', 'description' => 'Profil d’entreprise ou d’organisation', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'marchand', 'description' => 'Profil marchand pour la vente', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'client', 'description' => 'Profil client ou acheteur', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_types');
    }
};
