<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Storage;

class ArchiveMedia
{
    public static function url(string $path): string
    {
        return '/storage/'.ltrim($path, '/');
    }

    public static function rule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if ($value === null || $value === '') {
                return;
            }

            if (filter_var($value, FILTER_VALIDATE_URL) || self::pathFromUrl((string) $value)) {
                return;
            }

            $fail('The '.$attribute.' field must be a valid URL or uploaded archive file.');
        };
    }

    public static function delete(?string $url): void
    {
        $path = self::pathFromUrl($url);

        if (! $path) {
            return;
        }

        Storage::disk('public')->delete($path);
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

        $path = parse_url($url, PHP_URL_PATH) ?: $url;

        if (! str_starts_with($path, '/storage/')) {
            return null;
        }

        $storagePath = ltrim(substr($path, strlen('/storage/')), '/');

        return str_starts_with($storagePath, 'archive/') ? $storagePath : null;
    }
}
