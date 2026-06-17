<?php

namespace Tests\Feature;

use App\Models\Link;
use App\Models\Moment;
use App\Models\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ArchiveApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('The pdo_sqlite extension is required for archive database feature tests.');
        }

        parent::setUp();

        config([
            'archive.media.disk' => 'public',
            'archive.media.public_url' => null,
            'archive.media.bucket' => null,
        ]);
    }

    public function test_public_archive_returns_empty_arrays_when_database_is_empty(): void
    {
        $this->getJson('/api/archive')
            ->assertOk()
            ->assertJsonPath('links', [])
            ->assertJsonPath('moments', [])
            ->assertJsonPath('members', [])
            ->assertJsonPath('messages', []);
    }

    public function test_public_messages_are_visible_immediately_after_submit(): void
    {
        $this->postJson('/api/messages', [
            'name' => 'Visitor',
            'message' => 'Langsung tampil dong.',
        ])
            ->assertCreated()
            ->assertJsonPath('is_visible', true);

        $this->assertDatabaseHas('messages', [
            'name' => 'Visitor',
            'is_visible' => true,
        ]);

        $this->getJson('/api/messages')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_public_message_honeypot_blocks_bot_submissions(): void
    {
        $this->postJson('/api/messages', [
            'name' => 'Bot',
            'message' => 'Spam yang pura-pura nostalgia.',
            'website' => 'https://spam.example',
        ])
            ->assertUnprocessable();

        $this->assertDatabaseCount('messages', 0);
    }

    public function test_admin_can_create_link_with_a_typed_category(): void
    {
        $this->withAdminToken()
            ->postJson('/api/admin/links', [
                'category_name' => 'Dokumentasi Liar',
                'title' => 'Drive Kenangan',
                'url' => 'https://example.com/drive',
                'description' => null,
                'thumbnail_url' => null,
                'is_featured' => false,
                'sort_order' => 0,
            ])
            ->assertCreated()
            ->assertJsonPath('category.name', 'Dokumentasi Liar');

        $this->assertDatabaseHas('categories', [
            'name' => 'Dokumentasi Liar',
            'slug' => 'dokumentasi-liar',
        ]);
    }

    public function test_admin_upload_returns_a_relative_storage_url(): void
    {
        Storage::fake('public');

        $this->withAdminToken()
            ->post('/api/admin/uploads', [
                'kind' => 'image',
                'file' => UploadedFile::fake()->image('memory.jpg'),
            ])
            ->assertCreated()
            ->assertJsonPath('kind', 'image')
            ->assertJson(fn ($json) => $json
                ->where('url', fn (string $url) => str_starts_with($url, '/storage/archive/images/'))
                ->etc()
            );
    }

    public function test_admin_media_paths_validate_and_old_link_media_is_cleaned_up(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('archive/images/old.jpg', 'old');
        Storage::disk('public')->put('archive/images/new.jpg', 'new');

        $link = Link::create([
            'title' => 'Drive',
            'url' => 'https://example.com',
            'thumbnail_url' => '/storage/archive/images/old.jpg',
        ]);

        $this->withAdminToken()
            ->putJson('/api/admin/links/'.$link->id, [
                'category_id' => null,
                'title' => 'Drive Updated',
                'description' => null,
                'url' => 'https://example.com',
                'thumbnail_url' => '/storage/archive/images/new.jpg',
                'is_featured' => false,
                'sort_order' => 0,
            ])
            ->assertOk()
            ->assertJsonPath('thumbnail_url', '/storage/archive/images/new.jpg');

        Storage::disk('public')->assertMissing('archive/images/old.jpg');
        Storage::disk('public')->assertExists('archive/images/new.jpg');
    }

    public function test_deleting_a_moment_cleans_up_uploaded_photo_files(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('archive/images/moment.jpg', 'image');

        $moment = Moment::create([
            'title' => 'Uploaded Moment',
            'slug' => 'uploaded-moment',
        ]);
        Photo::create([
            'moment_id' => $moment->id,
            'image_url' => '/storage/archive/images/moment.jpg',
        ]);

        $this->withAdminToken()
            ->deleteJson('/api/admin/moments/'.$moment->id)
            ->assertOk();

        $this->assertDatabaseMissing('moments', ['id' => $moment->id]);
        $this->assertDatabaseMissing('photos', ['moment_id' => $moment->id]);
        Storage::disk('public')->assertMissing('archive/images/moment.jpg');
    }

    private function withAdminToken(): self
    {
        $token = 'test-admin-token';
        Cache::put('admin-token:'.hash('sha256', $token), true, now()->addMinutes(5));

        return $this->withHeader('Authorization', 'Bearer '.$token);
    }
}
