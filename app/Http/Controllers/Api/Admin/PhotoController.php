<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
    public function index()
    {
        return Photo::with('moment')->orderBy('sort_order')->orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $photo = Photo::create($this->validatePhoto($request));

        return response()->json($photo->load('moment'), 201);
    }

    public function show(Photo $photo)
    {
        return $photo->load('moment');
    }

    public function update(Request $request, Photo $photo)
    {
        $photo->update($this->validatePhoto($request));

        return response()->json($photo->load('moment'));
    }

    public function destroy(Photo $photo)
    {
        $photo->delete();

        return response()->json(['message' => 'Photo deleted']);
    }

    private function validatePhoto(Request $request): array
    {
        return $request->validate([
            'moment_id' => ['required', 'exists:moments,id'],
            'image_url' => ['required', 'url', 'max:2048'],
            'caption' => ['nullable', 'string', 'max:500'],
            'rotation' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['integer', 'min:0'],
        ]);
    }
}
