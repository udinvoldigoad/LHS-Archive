<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Support\ArchiveMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kind' => ['required', Rule::in(['image', 'video', 'audio'])],
        ]);

        $kind = $validated['kind'];

        $request->validate([
            'file' => $this->rulesForKind($kind),
        ]);

        $file = $request->file('file');
        $path = Storage::disk(ArchiveMedia::disk())->putFile('archive/'.$kind.'s', $file);

        return response()->json([
            'kind' => $kind,
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => ArchiveMedia::url($path),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ], 201);
    }

    private function rulesForKind(string $kind): array
    {
        return match ($kind) {
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'video' => ['required', 'file', 'mimes:mp4,webm,mov', 'max:30720'],
            'audio' => ['required', 'file', 'mimes:mp3,wav,ogg,m4a', 'max:2048'],
        };
    }
}
