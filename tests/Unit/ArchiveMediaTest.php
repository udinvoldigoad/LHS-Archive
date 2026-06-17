<?php

namespace Tests\Unit;

use App\Support\ArchiveMedia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ArchiveMediaTest extends TestCase
{
    public function test_it_builds_supabase_public_urls(): void
    {
        config([
            'archive.media.disk' => 'supabase',
            'archive.media.public_url' => 'https://project.supabase.co/storage/v1/object/public/lhs-archive',
            'archive.media.bucket' => 'lhs-archive',
        ]);

        $this->assertSame(
            'https://project.supabase.co/storage/v1/object/public/lhs-archive/archive/images/photo.jpg',
            ArchiveMedia::url('archive/images/photo.jpg'),
        );
    }

    public function test_it_deletes_supabase_public_urls_from_the_configured_disk(): void
    {
        Storage::fake('supabase');
        Storage::disk('supabase')->put('archive/images/photo.jpg', 'image');

        config([
            'archive.media.disk' => 'supabase',
            'archive.media.public_url' => 'https://project.supabase.co/storage/v1/object/public/lhs-archive',
            'archive.media.bucket' => 'lhs-archive',
        ]);

        ArchiveMedia::delete('https://project.supabase.co/storage/v1/object/public/lhs-archive/archive/images/photo.jpg');

        Storage::disk('supabase')->assertMissing('archive/images/photo.jpg');
    }

    public function test_external_media_urls_are_allowed_outside_production(): void
    {
        config(['archive.media.allow_external_urls' => false]);

        $validator = Validator::make(
            ['media' => 'https://images.example/photo.jpg'],
            ['media' => [ArchiveMedia::rule()]],
        );

        $this->assertFalse($validator->fails());
    }

    public function test_external_media_urls_are_blocked_in_production_by_default(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        config(['archive.media.allow_external_urls' => false]);

        $validator = Validator::make(
            ['media' => 'https://images.example/photo.jpg'],
            ['media' => [ArchiveMedia::rule()]],
        );

        $this->assertTrue($validator->fails());
    }
}
