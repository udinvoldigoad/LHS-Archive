<?php

return [
    'admin' => [
        'password' => env('ADMIN_PASSWORD'),
        'password_hash' => env('ADMIN_PASSWORD_HASH'),
        'allow_plain_password' => (bool) env('ADMIN_ALLOW_PLAIN_PASSWORD', false),
        'token_ttl_minutes' => (int) env('ADMIN_TOKEN_TTL_MINUTES', 480),
    ],

    'media' => [
        'disk' => env('ARCHIVE_MEDIA_DISK', env('FILESYSTEM_DISK', 'public')),
        'public_url' => env('SUPABASE_PUBLIC_URL'),
        'bucket' => env('SUPABASE_STORAGE_BUCKET', env('AWS_BUCKET')),
        'allow_external_urls' => (bool) env('ARCHIVE_ALLOW_EXTERNAL_MEDIA_URLS', false),
        'image_format' => env('ARCHIVE_IMAGE_FORMAT', 'webp'),
        'image_quality' => (int) env('ARCHIVE_IMAGE_QUALITY', 82),
        'image_max_dimension' => (int) env('ARCHIVE_IMAGE_MAX_DIMENSION', 1600),
        'thumbnail_max_dimension' => (int) env('ARCHIVE_THUMBNAIL_MAX_DIMENSION', 640),
    ],

    'cache' => [
        'public_archive_ttl_seconds' => (int) env('ARCHIVE_PUBLIC_CACHE_TTL_SECONDS', 300),
    ],
];
