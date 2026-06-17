<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'name',
        'nickname',
        'role',
        'quote',
        'photo_url',
        'thumbnail_url',
        'instagram_url',
        'fun_fact',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
