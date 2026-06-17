<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Support\ArchiveImageOptimizer;
use App\Support\ArchiveMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Throwable;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kind' => ['required', Rule::in(['image', 'video', 'audio'])],
            'variant' => ['nullable', Rule::in(['thumbnail'])],
        ]);

        $kind = $validated['kind'];

        $request->validate([
            'file' => $this->rulesForKind($kind),
        ]);

        $file = $request->file('file');

        if ($kind === 'image') {
            try {
                return response()->json([
                    'kind' => $kind,
                    'name' => $file->getClientOriginalName(),
                    'original_mime_type' => $file->getMimeType(),
                    'original_size' => $file->getSize(),
                    ...ArchiveImageOptimizer::store($file, ($validated['variant'] ?? null) === 'thumbnail'),
                ], 201);
            } catch (Throwable) {
                return response()->json([
                    'kind' => $kind,
                    'name' => $file->getClientOriginalName(),
                    'original_mime_type' => $file->getMimeType(),
                    'original_size' => $file->getSize(),
                    ...$this->storeOriginalImage($file),
                    'optimized' => false,
                    'message' => 'Image uploaded without optimization because the server image optimizer is unavailable.',
                ], 201);
            }
        }

        try {
            $path = Storage::disk(ArchiveMedia::disk())->putFile('archive/'.$kind.'s', $file);
        } catch (Throwable) {
            return response()->json([
                'message' => 'Upload storage failed. Check Supabase storage variables and bucket permissions.',
            ], 502);
        }

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

    private function storeOriginalImage(UploadedFile $file): array
    {
        try {
            $path = Storage::disk(ArchiveMedia::disk())->putFile('archive/images', $file);
        } catch (Throwable) {
            abort(response()->json([
                'message' => 'Upload storage failed. Check Supabase storage variables and bucket permissions.',
            ], 502));
        }

        $url = ArchiveMedia::url($path);

        return [
            'path' => $path,
            'url' => $url,
            'thumbnail_path' => $path,
            'thumbnail_url' => $url,
            'mime_type' => $file->getMimeType(),
            'extension' => $file->extension(),
            'width' => null,
            'height' => null,
            'thumbnail_width' => null,
            'thumbnail_height' => null,
        ];
    }
}
