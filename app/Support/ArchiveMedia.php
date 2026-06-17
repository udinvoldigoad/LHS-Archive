<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Storage;

class ArchiveMedia
{
    public static function disk(): string
    {
        return (string) config('archive.media.disk', 'public');
    }

    public static function url(string $path): string
    {
        $path = ltrim($path, '/');
        $publicUrl = trim((string) config('archive.media.public_url', ''));

        if ($publicUrl !== '') {
            return rtrim($publicUrl, '/').'/'.$path;
        }

        if (self::disk() === 'public') {
            return '/storage/'.$path;
        }

        return Storage::disk(self::disk())->url($path);
    }

    public static function rule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if ($value === null || $value === '') {
                return;
            }

            if (self::pathFromUrl((string) $value) || self::externalUrlIsAllowed((string) $value)) {
                return;
            }

            $fail('The '.$attribute.' field must be an uploaded archive file.');
        };
    }

    public static function delete(?string $url): void
    {
        $path = self::pathFromUrl($url);

        if (! $path) {
            return;
        }

        Storage::disk(self::disk())->delete($path);
    }

    public static function deleteIfChanged(?string $oldUrl, ?string $newUrl): void
    {
        if ($oldUrl === $newUrl) {
            return;
        }

        self::delete($oldUrl);
    }

    private static function pathFromUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $url = trim($url);
        $withoutQuery = strtok($url, '?') ?: $url;
        $publicUrl = rtrim((string) config('archive.media.public_url', ''), '/');

        if ($publicUrl !== '' && str_starts_with($withoutQuery, $publicUrl.'/')) {
            return self::managedPath(substr($withoutQuery, strlen($publicUrl) + 1));
        }

        if (str_starts_with($withoutQuery, 'archive/')) {
            return self::managedPath($withoutQuery);
        }

        $path = parse_url($url, PHP_URL_PATH) ?: $withoutQuery;

        $supabasePath = self::supabasePublicPath($path);

        if ($supabasePath) {
            return $supabasePath;
        }

        if (! str_starts_with($path, '/storage/')) {
            return null;
        }

        $storagePath = ltrim(substr($path, strlen('/storage/')), '/');

        return self::managedPath($storagePath);
    }

    private static function supabasePublicPath(string $path): ?string
    {
        $bucket = trim((string) config('archive.media.bucket', ''));

        if ($bucket === '') {
            return null;
        }

        $prefix = '/storage/v1/object/public/'.$bucket.'/';

        if (! str_starts_with($path, $prefix)) {
            return null;
        }

        return self::managedPath(substr($path, strlen($prefix)));
    }

    private static function managedPath(string $path): ?string
    {
        $path = ltrim($path, '/');

        return str_starts_with($path, 'archive/') ? $path : null;
    }

    private static function externalUrlIsAllowed(string $url): bool
    {
        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        return (bool) config('archive.media.allow_external_urls', false);
    }
}
