<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $albums = $request
            ->user()
            ->albums()
            ->with(['tags', 'images'])
            ->withCount('images')
            ->latest()
            ->get();

        return inertia('albums/index', [
            'albums' => $albums,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $images = $request->user()->images()->with('tags')->latest()->get();
        $tags = $request->user()->tags()->latest()->get();

        return inertia('albums/create', [
            'images' => $images,
            'tags' => $tags
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'images.*' => 'required|image|max:51200',
            'tags' => 'nullable|array',
            'tags.*' => 'integer|exists:tags,id',
        ]);

        $images = [];
        foreach ($request->file('images') as $file) {
            $path = $file->store('images', 'public'); // Store the file in the 'images' folder

            $filename = basename($path); // Extract only the filename
            $size = $file->getSize(); // Get the file size in bytes

            $image = $request->user()->images()->create([
                'title' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME), // Use file name as title
                'filename' => $filename, // Save only the filename
                'size' => $size, // Save the file size
            ]);

            $images[] = $image->id;
        }

        $album = $request->user()->albums()->create([
            'title' => $request->title,
            'description' => $request->description
        ]);
        $album->tags()->sync($request->tags);
        $album->images()->sync($images);

        return redirect()->route('albums.index')->with('success', '¡Álbum creado correctamente!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Album $album)
    {
        $album->load('images.tags');

        return inertia('albums/show', [
            'album' => $album
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Album $album)
    {
        $response = Gate::inspect('update', $album);

        if(!$response->allowed()) {
            return to_route('albums.index')->with('error', $response->message());
        }

        $album->load('tags');

        $tags = $request->user()->tags()->latest()->get();

        return inertia('albums/edit', [
            'album' => $album,
            'tags' => $tags
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Album $album)
    {
        $response = Gate::inspect('update', $album);

        if(!$response->allowed()) {
            return to_route('albums.index')->with('error', $response->message());
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'cover_image' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'integer|exists:tags,id',
        ]);

        $album->update([
            'title' => $request->title,
            'description' => $request->description,
            'cover_image' => $request->cover_image
        ]);

        $album->tags()->sync($request->tags);

        return redirect()->route('albums.index')->with('success', '¡Álbum actualizado correctamente!');
    }

    public function add(Album $album) {
        $response = Gate::inspect('update', $album);

        if(!$response->allowed()) {
            return to_route('albums.index')->with('error', $response->message());
        }

        return inertia('albums/add', [
            'album' => $album
        ]);
    }

    public function upload(Request $request, Album $album)
    {
        $response = Gate::inspect('update', $album);

        if(!$response->allowed()) {
            return to_route('albums.index')->with('error', $response->message());
        }

        $request->validate([
            'images.*' => 'required|image|max:51200',
        ]);

        $images = [];
        foreach ($request->file('images') as $file) {
            $path = $file->store('images', 'public'); // Store the file in the 'images' folder

            $filename = basename($path); // Extract only the filename
            $size = $file->getSize(); // Get the file size in bytes

            $image = $request->user()->images()->create([
                'title' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME), // Use file name as title
                'filename' => $filename, // Save only the filename
                'size' => $size, // Save the file size
            ]);

            $images[] = $image->id;
        }

        $album->images()->syncWithoutDetaching($images);

        return redirect()->route('albums.show', [ 'album' => $album ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Album $album)
    {
        $response = Gate::inspect('forceDelete', $album);

        if(!$response->allowed()) {
            return to_route('albums.index')->with('error', $response->message());
        }

        $album->delete();
    }
}
