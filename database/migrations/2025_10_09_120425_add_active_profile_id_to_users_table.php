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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('active_profile_id')->after('status_id')->nullable()->constrained('profiles')->onUpdate('cascade')->onDelete('set null');
            /*$table->foreign('active_profile_id')
                  ->references('id')
                  ->on('profiles')
                  ->onUpdate('cascade')
                  ->onDelete('set null');*/
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
