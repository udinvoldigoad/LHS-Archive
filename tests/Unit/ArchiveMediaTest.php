<?php

namespace Tests\Unit;

use App\Support\ArchiveMedia;
use Illuminate\Support\Facades\Storage;
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
}
