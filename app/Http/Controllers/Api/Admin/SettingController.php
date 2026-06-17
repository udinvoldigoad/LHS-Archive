<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
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
            'best_moment_video_url' => ['nullable', 'url', 'max:2048'],
            'background_music_url' => ['nullable', 'url', 'max:2048'],
        ]);

        $settings = Setting::firstOrCreate([]);
        $settings->update($validated);

        return response()->json($settings);
    }
}
