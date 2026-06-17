<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    protected $fillable = [
        'moment_id',
        'image_url',
        'thumbnail_url',
        'caption',
        'rotation',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function moment(): BelongsTo
    {
        return $this->belongsTo(Moment::class);
    }
}
