<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AdminAuthController;

Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout']);

Route::middleware('simple.admin')->prefix('admin')->group(function () {
    Route::get('/dashboard', fn () => ['message' => 'admin dashboard ok']);
});