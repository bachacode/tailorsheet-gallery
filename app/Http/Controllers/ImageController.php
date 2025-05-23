<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return inertia('images/index', [
            'images' => $request->user()->images()->with('tags')->latest()->get(),
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
            'images.*' => 'required|image|max:51200',
        ]);

        foreach ($request->file('images') as $file) {
            $path = $file->store('images', 'public');

            $filename = basename($path);
            $size = $file->getSize();

            $request->user()->images()->create([
                'title' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                'filename' => $filename,
                'size' => $size,
            ]);
        }

        return to_route('images.index')->with('success', '¡Imágenes subidas correctamente!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Image $image)
    {
        $response = Gate::inspect('update', $image);

        if(!$response->allowed()) {
            return to_route('images.index')->with('error', $response->message());
        }

        $image->load('tags');

        return inertia('images/edit', [
            'image' => $image,
            'tags' => $request->user()->tags()->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        $response = Gate::inspect('update', $image);

        if(!$response->allowed()) {
            return to_route('images.index')->with('error', $response->message());
        }

        // Validate the input
        $request->validate([
            'title' => 'required|string|max:255',
            'filename' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($image) {
                    $validExtensions = ['png', 'jpeg', 'jpg', 'webp', 'gif', 'bmp', 'tiff'];
                    $extension = strtolower(pathinfo($value, PATHINFO_EXTENSION));

                    // Validate the file extension
                    if (!in_array($extension, $validExtensions)) {
                        $fail("El campo $attribute debe ser un archivo de imagen válido (".implode(', ', $validExtensions).").");
                    }

                    // Validate that the new filename does not already exist
                    if ($value !== $image->filename && Storage::disk('public')->exists("images/{$value}")) {
                        $fail("El archivo con el nombre '{$value}' ya existe en el almacenamiento.");
                    }

                    // Validate that the old filename exists
                    if (!Storage::disk('public')->exists("images/{$image->filename}")) {
                        $fail("El archivo original '{$image->filename}' no existe en el almacenamiento.");
                    }
                },
            ],
            'description' => 'nullable|string|max:255',
            'tags' => 'nullable|array', // Ensure tags is an array
            'tags.*' => 'integer|exists:tags,id', // Ensure each tag is a valid integer and exists in the tags table
        ]);

        // Store the original filename in case we need to revert
        $originalFilename = $image->filename;

        try {
            // Rename the file in storage if the filename has changed
            if ($originalFilename !== $request->filename) {
                $originalPath = "images/{$originalFilename}";
                $newPath = "images/{$request->filename}";

                // Rename the file
                Storage::disk('public')->move($originalPath, $newPath);
            }

            // Update the database record
            $image->update([
                'title' => $request->title,
                'filename' => $request->filename,
                'description' => $request->description,
            ]);

            // Sync the tags
            $image->tags()->sync($request->tags);

            return redirect()->route('images.index')->with('success', '¡Imagen actualizada correctamente!');
        } catch (\Exception $e) {
            // Revert the filename in storage if renaming failed
            if ($originalFilename !== $request->filename) {
                $newPath = "images/{$request->filename}";
                $originalPath = "images/{$originalFilename}";

                if (Storage::disk('public')->exists($newPath)) {
                    Storage::disk('public')->move($newPath, $originalPath);
                }
            }

            // Revert the database changes
            $image->update([
                'filename' => $originalFilename,
            ]);

            return back()->withErrors(['error' => 'Ocurrió un error al actualizar la imagen. Por favor, inténtelo de nuevo.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        $response = Gate::inspect('forceDelete', $image);

        if(!$response->allowed()) {
            return back()->with('error', $response->message());
        }

        // Delete the image file from storage
        Storage::disk('public')->delete('images/' . $image->filename);

        // Delete the image record from the database
        $image->delete();
    }
}
