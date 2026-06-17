<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use App\Support\ArchiveCache;
use App\Support\ArchiveMedia;
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
        ArchiveCache::forgetPublic();

        return response()->json($photo->load('moment'), 201);
    }

    public function show(Photo $photo)
    {
        return $photo->load('moment');
    }

    public function update(Request $request, Photo $photo)
    {
        $oldImageUrl = $photo->image_url;
        $oldThumbnailUrl = $photo->thumbnail_url;
        $validated = $this->validatePhoto($request);

        $photo->update($validated);
        ArchiveMedia::deleteIfChanged($oldImageUrl, $photo->image_url);
        ArchiveMedia::deleteIfChanged($oldThumbnailUrl, $photo->thumbnail_url);
        ArchiveCache::forgetPublic();

        return response()->json($photo->load('moment'));
    }

    public function destroy(Photo $photo)
    {
        ArchiveMedia::delete($photo->image_url);
        ArchiveMedia::delete($photo->thumbnail_url);
        $photo->delete();
        ArchiveCache::forgetPublic();

        return response()->json(['message' => 'Photo deleted']);
    }

    private function validatePhoto(Request $request): array
    {
        return $request->validate([
            'moment_id' => ['required', 'exists:moments,id'],
            'image_url' => ['required', 'string', 'max:2048', ArchiveMedia::rule()],
            'thumbnail_url' => ['nullable', 'string', 'max:2048', ArchiveMedia::rule()],
            'caption' => ['nullable', 'string', 'max:500'],
            'rotation' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['integer', 'min:0'],
        ]);
    }
}
