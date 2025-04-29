<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        $images = $user->images()->latest()->get();

        return inertia('images/index', [
            'images' => $images,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('images/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|max:51200', // Validate each file
        ]);

        foreach ($request->file('images') as $file) {
            $path = $file->store('images', 'public'); // Store the file in the 'images' folder

            $filename = basename($path); // Extract only the filename
            $size = $file->getSize(); // Get the file size in bytes

            $request->user()->images()->create([
                'title' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME), // Use file name as title
                'filename' => $filename, // Save only the filename
                'size' => $size, // Save the file size
            ]);
        }

        return to_route('images.index')->with('success', 'Imágenes subidas correctamente!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $image = $user->images()->findOrFail($id);

        // Delete the image file from storage
        Storage::disk('public')->delete('images/' . $image->filename);

        // Delete the image record from the database
        $image->delete();
    }
}
