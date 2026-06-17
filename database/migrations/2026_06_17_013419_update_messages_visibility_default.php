<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE messages MODIFY is_visible TINYINT(1) NOT NULL DEFAULT 0');

            return;
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE messages ALTER COLUMN is_visible SET DEFAULT false');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE messages MODIFY is_visible TINYINT(1) NOT NULL DEFAULT 1');

            return;
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE messages ALTER COLUMN is_visible SET DEFAULT true');
        }
    }
};
