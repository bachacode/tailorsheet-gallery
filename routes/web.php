<?php

use App\Http\Controllers\ImageController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('images', ImageController::class)->except(['show']);
    Route::resource('tags', TagController::class)->except(['create', 'show', 'edit']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
