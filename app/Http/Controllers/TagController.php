<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tags = $request->user()->tags()->latest()->get();

        return inertia('tags/index', [
            'tags' => $tags,
        ]);
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        $response = Gate::inspect('update', $tag);

        if(!$response->allowed()) {
            return to_route('tags.index')->with('error', $response->message());
        }

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
    public function destroy(Tag $tag)
    {
        $response = Gate::inspect('forceDelete', $tag);

        if(!$response->allowed()) {
            return to_route('tags.index')->with('error', $response->message());
        }

        $tag->delete();
    }
}
