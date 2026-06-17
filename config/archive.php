<?php

return [
    'admin' => [
        'password' => env('ADMIN_PASSWORD'),
        'password_hash' => env('ADMIN_PASSWORD_HASH'),
        'token_ttl_minutes' => (int) env('ADMIN_TOKEN_TTL_MINUTES', 480),
    ],
];
