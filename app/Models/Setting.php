<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_title',
        'tagline',
        'best_moment_title',
        'best_moment_description',
        'best_moment_video_url',
        'background_music_url',
    ];
}
