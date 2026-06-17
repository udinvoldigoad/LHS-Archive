<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\ArchiveMedia;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function show()
    {
        return Setting::firstOrCreate([], [
            'site_title' => 'LHS Archive',
            'tagline' => 'Tempat kecil buat nyimpen semua hal yang pernah rame bareng.',
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_title' => ['required', 'string', 'max:180'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'best_moment_title' => ['nullable', 'string', 'max:180'],
            'best_moment_description' => ['nullable', 'string', 'max:800'],
            'best_moment_video_url' => ['nullable', 'string', 'max:2048', ArchiveMedia::rule()],
            'background_music_url' => ['nullable', 'string', 'max:2048', ArchiveMedia::rule()],
        ]);

        $settings = Setting::firstOrCreate([]);
        $oldVideoUrl = $settings->best_moment_video_url;
        $oldMusicUrl = $settings->background_music_url;

        $settings->update($validated);
        ArchiveMedia::deleteIfChanged($oldVideoUrl, $settings->best_moment_video_url);
        ArchiveMedia::deleteIfChanged($oldMusicUrl, $settings->background_music_url);

        return response()->json($settings);
    }
}
