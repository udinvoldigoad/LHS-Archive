<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'name',
        'message',
        'is_visible',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];
}
