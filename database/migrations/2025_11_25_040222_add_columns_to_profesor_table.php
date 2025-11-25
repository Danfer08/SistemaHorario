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
        Schema::table('profesor', function (Blueprint $table) {
            $table->string('telefono', 20)->nullable()->after('correo');
            $table->string('categoria', 50)->default('ordinario')->after('telefono');
            $table->string('estado', 20)->default('activo')->after('categoria');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profesor', function (Blueprint $table) {
            $table->dropColumn(['telefono', 'categoria', 'estado']);
        });
    }
};
