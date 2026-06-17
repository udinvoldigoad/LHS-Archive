<?php

namespace Tests\Unit;

use App\Support\ArchiveCache;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class ArchiveCacheTest extends TestCase
{
    protected function tearDown(): void
    {
        Cache::flush();

        parent::tearDown();
    }

    public function test_it_caches_the_public_archive_payload(): void
    {
        config(['archive.cache.public_archive_ttl_seconds' => 300]);
        $calls = 0;

        $first = ArchiveCache::rememberPublic(function () use (&$calls) {
            $calls++;

            return ['version' => $calls];
        });
        $second = ArchiveCache::rememberPublic(function () use (&$calls) {
            $calls++;

            return ['version' => $calls];
        });

        $this->assertSame(['version' => 1], $first);
        $this->assertSame(['version' => 1], $second);
        $this->assertSame(1, $calls);
    }

    public function test_it_can_bypass_public_archive_cache(): void
    {
        config(['archive.cache.public_archive_ttl_seconds' => 0]);
        $calls = 0;

        ArchiveCache::rememberPublic(function () use (&$calls) {
            $calls++;

            return ['version' => $calls];
        });
        ArchiveCache::rememberPublic(function () use (&$calls) {
            $calls++;

            return ['version' => $calls];
        });

        $this->assertSame(2, $calls);
    }
}
