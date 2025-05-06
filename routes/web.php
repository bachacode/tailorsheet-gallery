<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Imagenes
    Route::resource('images', ImageController::class)
    ->except(['show']);

    Route::resource('tags', TagController::class)->except(['create', 'show', 'edit']);

    Route::controller(AlbumController::class)->group(function () {
        Route::get('/albums', 'index')->name('albums.index');

        Route::get('/albums/crear', 'create')->name('albums.create');
        Route::post('/albums', 'store')->name('albums.store');

        Route::get('/albums/{album}/editar', 'edit')->name('albums.edit');
        Route::patch('/albums/{album}', 'update')->name('albums.update');

        Route::get('albums/{album}/añadir-imagenes', 'add')->name('albums.add');
        Route::post('albums/{album}/subir-imagenes', 'upload')->name('albums.upload');

        Route::delete('/albums/{album}', 'destroy')->name('albums.destroy');
    });
    // Route::resource('albums', AlbumController::class)->except(['show']);
    // Route::get('albums/{id}/add', [AlbumController::class, 'add'])->name('albums.add');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
