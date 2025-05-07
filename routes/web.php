<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Imagenes
    Route::controller(ImageController::class)
    ->prefix('imagenes')
    ->name('images.')
    ->group(function () {
        Route::get('/', 'index')->name('index');

        Route::get('/crear', 'create')->name('create');
        Route::post('/', 'store')->name('store');

        Route::get('/{image}/editar', 'edit')->name('edit');

        Route::patch('/{image}', 'update')->name('update');
        Route::delete('/{image}', 'destroy')->name('destroy');
    });

    // Etiquetas
    Route::controller(TagController::class)
    ->prefix('etiquetas')
    ->name('tags.')
    ->group(function () {
        Route::get('/', 'index')->name('index');

        Route::post('/', 'store')->name('store');

        Route::patch('/{tag}', 'update')->name('update');
        Route::delete('/{tag}', 'destroy')->name('destroy');
    });

    // Álbumes
    Route::controller(AlbumController::class)
    ->prefix('albumes')
    ->name('albums.')
    ->group(function () {
        Route::get('/', 'index')->name('index');

        Route::get('/crear', 'create')->name('create');
        Route::post('/', 'store')->name('store');

        Route::get('/{album}/editar', 'edit')->name('edit');
        Route::get('/{album}/añadir-imagenes', 'add')->name('add');
        Route::post('/{album}/subir-imagenes', 'upload')->name('upload');

        Route::patch('/{album}', 'update')->name('update');
        Route::delete('/{album}', 'destroy')->name('destroy');

        Route::get('/{album}', 'show')->name('show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
