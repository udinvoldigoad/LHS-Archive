<?php

return [
    'admin' => [
        'password' => env('ADMIN_PASSWORD'),
        'password_hash' => env('ADMIN_PASSWORD_HASH'),
        'token_ttl_minutes' => (int) env('ADMIN_TOKEN_TTL_MINUTES', 480),
    ],

    'media' => [
        'disk' => env('ARCHIVE_MEDIA_DISK', env('FILESYSTEM_DISK', 'public')),
        'public_url' => env('SUPABASE_PUBLIC_URL'),
        'bucket' => env('SUPABASE_STORAGE_BUCKET', env('AWS_BUCKET')),
    ],
];
