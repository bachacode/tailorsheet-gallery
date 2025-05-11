<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = $request->user()->withCount(['images', 'albums'])->withSum('images', 'size')->first();
        $albums = $user->albums()->with(['images', 'tags'])->withCount('images')->get();
        return inertia('dashboard', [
            'user' => $user,
            'albums' => $albums
        ]);
    }
}
