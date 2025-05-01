<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       /** @var \App\Models\User */
       $user = Auth::user();

       $tags = $user->tags()->latest()->get();

        return inertia('tags/index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:tags|string|max:255',
        ]);

        $request->user()->tags()->create([
            'name' => $request->name,
        ]);

        return to_route('tags.index')->with('success', '¡Etiqueta creada correctamente!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        $request->validate([
            'name' => 'required|unique:tags|string|max:255',
        ]);

        $tag->update([
            'name' => $request->name
        ]);

        return Session::flash('success', '¡Etiqueta editada correctamente!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $tag = $user->tags()->findOrFail($id);

        // Delete the tag record from the database
        $tag->delete();
    }
}
