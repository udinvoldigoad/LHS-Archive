<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class ArchiveCache
{
    private const PUBLIC_ARCHIVE_KEY = 'archive.public.v1';

    public static function rememberPublic(callable $callback): mixed
    {
        $ttlSeconds = max(0, (int) config('archive.cache.public_archive_ttl_seconds', 300));

        if ($ttlSeconds === 0) {
            return $callback();
        }

        return Cache::remember(self::PUBLIC_ARCHIVE_KEY, now()->addSeconds($ttlSeconds), $callback);
    }

    public static function forgetPublic(): void
    {
        Cache::forget(self::PUBLIC_ARCHIVE_KEY);
    }
}
