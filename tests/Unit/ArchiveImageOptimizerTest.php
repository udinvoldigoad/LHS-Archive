<?php

namespace Tests\Unit;

use App\Support\ArchiveImageOptimizer;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ArchiveImageOptimizerTest extends TestCase
{
    protected function setUp(): void
    {
        if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
            $this->markTestSkipped('The GD extension with WebP support is required for image optimizer tests.');
        }

        parent::setUp();

        Storage::fake('public');

        config([
            'archive.media.disk' => 'public',
            'archive.media.public_url' => null,
            'archive.media.image_format' => 'webp',
            'archive.media.image_quality' => 82,
            'archive.media.image_max_dimension' => 1200,
            'archive.media.thumbnail_max_dimension' => 360,
        ]);
    }

    public function test_it_converts_uploaded_images_and_creates_a_thumbnail(): void
    {
        $media = ArchiveImageOptimizer::store(UploadedFile::fake()->image('memory.jpg', 2000, 1200));

        $this->assertSame('webp', $media['extension']);
        $this->assertSame('image/webp', $media['mime_type']);
        $this->assertStringStartsWith('/storage/archive/images/', $media['url']);
        $this->assertStringStartsWith('/storage/archive/thumbnails/', $media['thumbnail_url']);
        $this->assertLessThanOrEqual(1200, max($media['width'], $media['height']));
        $this->assertLessThanOrEqual(360, max($media['thumbnail_width'], $media['thumbnail_height']));

        Storage::disk('public')->assertExists($media['path']);
        Storage::disk('public')->assertExists($media['thumbnail_path']);
    }

    public function test_it_can_store_thumbnail_only_uploads(): void
    {
        $media = ArchiveImageOptimizer::store(UploadedFile::fake()->image('link.jpg', 1600, 900), true);

        $this->assertSame($media['url'], $media['thumbnail_url']);
        $this->assertSame($media['path'], $media['thumbnail_path']);
        $this->assertStringStartsWith('/storage/archive/thumbnails/', $media['url']);
        $this->assertLessThanOrEqual(360, max($media['width'], $media['height']));

        Storage::disk('public')->assertExists($media['thumbnail_path']);
        $this->assertSame(['archive/thumbnails'], collect(Storage::disk('public')->directories('archive'))->values()->all());
    }
}
