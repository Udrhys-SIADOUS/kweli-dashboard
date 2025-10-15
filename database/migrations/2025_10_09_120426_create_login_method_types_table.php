<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('login_method_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        DB::table('login_method_types')->insert([
            ['name' => 'email', 'description' => 'Connexion via adresse e-mail', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'username', 'description' => 'Connexion via nom d’utilisateur', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'phone', 'description' => 'Connexion via numéro de téléphone', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'google', 'description' => 'Connexion via OAuth Google', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'facebook', 'description' => 'Connexion via OAuth Facebook', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'apple', 'description' => 'Connexion via OAuth Apple', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('login_method_types');
    }
};
