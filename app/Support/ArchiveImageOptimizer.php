<?php

namespace App\Support;

use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ArchiveImageOptimizer
{
    public static function store(UploadedFile $file, bool $thumbnailOnly = false): array
    {
        $source = self::sourceImage($file);
        $format = self::format();
        $extension = $format === 'avif' ? 'avif' : 'webp';
        $baseName = (string) Str::uuid();
        $imagePath = 'archive/images/'.$baseName.'.'.$extension;
        $thumbnailPath = 'archive/thumbnails/'.$baseName.'.'.$extension;

        if ($thumbnailOnly) {
            $thumbnail = self::resizeWithin($source, self::maxDimension('thumbnail_max_dimension', 640));

            Storage::disk(ArchiveMedia::disk())->put($thumbnailPath, self::encode($thumbnail, $format));

            $thumbnailWidth = imagesx($thumbnail);
            $thumbnailHeight = imagesy($thumbnail);

            imagedestroy($source);
            imagedestroy($thumbnail);

            return [
                'path' => $thumbnailPath,
                'url' => ArchiveMedia::url($thumbnailPath),
                'thumbnail_path' => $thumbnailPath,
                'thumbnail_url' => ArchiveMedia::url($thumbnailPath),
                'mime_type' => 'image/'.$extension,
                'extension' => $extension,
                'width' => $thumbnailWidth,
                'height' => $thumbnailHeight,
                'thumbnail_width' => $thumbnailWidth,
                'thumbnail_height' => $thumbnailHeight,
            ];
        }

        $optimized = self::resizeWithin($source, self::maxDimension('image_max_dimension', 1600));
        $thumbnail = self::resizeWithin($source, self::maxDimension('thumbnail_max_dimension', 640));

        Storage::disk(ArchiveMedia::disk())->put($imagePath, self::encode($optimized, $format));
        Storage::disk(ArchiveMedia::disk())->put($thumbnailPath, self::encode($thumbnail, $format));

        $width = imagesx($optimized);
        $height = imagesy($optimized);
        $thumbnailWidth = imagesx($thumbnail);
        $thumbnailHeight = imagesy($thumbnail);

        imagedestroy($source);
        imagedestroy($optimized);
        imagedestroy($thumbnail);

        return [
            'path' => $imagePath,
            'url' => ArchiveMedia::url($imagePath),
            'thumbnail_path' => $thumbnailPath,
            'thumbnail_url' => ArchiveMedia::url($thumbnailPath),
            'mime_type' => 'image/'.$extension,
            'extension' => $extension,
            'width' => $width,
            'height' => $height,
            'thumbnail_width' => $thumbnailWidth,
            'thumbnail_height' => $thumbnailHeight,
        ];
    }

    private static function sourceImage(UploadedFile $file): GdImage
    {
        $path = $file->getRealPath();
        $mimeType = $file->getMimeType();

        if (! is_string($path) || $path === '') {
            throw new RuntimeException('The uploaded image could not be read.');
        }

        $image = match ($mimeType) {
            'image/jpeg' => imagecreatefromjpeg($path),
            'image/png' => imagecreatefrompng($path),
            'image/webp' => imagecreatefromwebp($path),
            'image/gif' => imagecreatefromgif($path),
            default => false,
        };

        if (! $image instanceof GdImage) {
            throw new RuntimeException('The uploaded image could not be optimized.');
        }

        if ($mimeType === 'image/jpeg') {
            $image = self::applyJpegOrientation($image, $path);
        }

        return self::trueColorWithAlpha($image);
    }

    private static function applyJpegOrientation(GdImage $image, string $path): GdImage
    {
        if (! function_exists('exif_read_data')) {
            return $image;
        }

        $exif = @exif_read_data($path);
        $orientation = (int) ($exif['Orientation'] ?? 1);

        $rotated = match ($orientation) {
            3 => imagerotate($image, 180, 0),
            6 => imagerotate($image, -90, 0),
            8 => imagerotate($image, 90, 0),
            default => $image,
        };

        return $rotated instanceof GdImage ? $rotated : $image;
    }

    private static function resizeWithin(GdImage $source, int $maxDimension): GdImage
    {
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $scale = min(1, $maxDimension / max($sourceWidth, $sourceHeight));
        $targetWidth = max(1, (int) round($sourceWidth * $scale));
        $targetHeight = max(1, (int) round($sourceHeight * $scale));

        $target = imagecreatetruecolor($targetWidth, $targetHeight);
        imagealphablending($target, false);
        imagesavealpha($target, true);
        imagefill($target, 0, 0, imagecolorallocatealpha($target, 0, 0, 0, 127));

        imagecopyresampled(
            $target,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight,
        );

        return $target;
    }

    private static function encode(GdImage $image, string $format): string
    {
        ob_start();
        $success = $format === 'avif'
            ? imageavif($image, null, self::quality(), 6)
            : imagewebp($image, null, self::quality());
        $contents = ob_get_clean();

        if (! $success || $contents === false) {
            throw new RuntimeException('The optimized image could not be encoded.');
        }

        return $contents;
    }

    private static function trueColorWithAlpha(GdImage $image): GdImage
    {
        imagepalettetotruecolor($image);
        imagealphablending($image, false);
        imagesavealpha($image, true);

        return $image;
    }

    private static function format(): string
    {
        $format = strtolower((string) config('archive.media.image_format', 'webp'));

        return $format === 'avif' && function_exists('imageavif') ? 'avif' : 'webp';
    }

    private static function quality(): int
    {
        return max(1, min(100, (int) config('archive.media.image_quality', 82)));
    }

    private static function maxDimension(string $key, int $fallback): int
    {
        return max(320, (int) config('archive.media.'.$key, $fallback));
    }
}
