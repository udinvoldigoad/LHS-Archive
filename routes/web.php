<?php

use Illuminate\Support\Facades\Route;

Route::get('/images/hero-background.jpg', fn () => response()->file(public_path('images/hero-background.jpg')));
Route::view('/', 'app');
Route::view('/admin', 'app');
