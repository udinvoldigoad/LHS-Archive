<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\LinkController;
use App\Http\Controllers\Api\Admin\MemberController;
use App\Http\Controllers\Api\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Api\Admin\MomentController;
use App\Http\Controllers\Api\Admin\PhotoController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\PublicArchiveController;

Route::get('/archive', [PublicArchiveController::class, 'archive']);
Route::get('/settings', [PublicArchiveController::class, 'settings']);
Route::get('/categories', [PublicArchiveController::class, 'categories']);
Route::get('/links', [PublicArchiveController::class, 'links']);
Route::get('/moments', [PublicArchiveController::class, 'moments']);
Route::get('/moments/{moment:slug}', [PublicArchiveController::class, 'moment']);
Route::get('/members', [PublicArchiveController::class, 'members']);
Route::get('/messages', [PublicArchiveController::class, 'messages']);
Route::post('/messages', [PublicArchiveController::class, 'storeMessage']);

Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout']);

Route::middleware('simple.admin')->prefix('admin')->group(function () {
    Route::get('/dashboard', DashboardController::class);
    Route::get('/settings', [SettingController::class, 'show']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::apiResource('categories', CategoryController::class)->except(['show']);
    Route::apiResource('links', LinkController::class);
    Route::apiResource('moments', MomentController::class);
    Route::apiResource('photos', PhotoController::class);
    Route::apiResource('members', MemberController::class);
    Route::get('/messages', [AdminMessageController::class, 'index']);
    Route::put('/messages/{message}/visibility', [AdminMessageController::class, 'updateVisibility']);
    Route::delete('/messages/{message}', [AdminMessageController::class, 'destroy']);
});
