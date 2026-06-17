<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    protected function tearDown(): void
    {
        Cache::flush();

        parent::tearDown();
    }

    public function test_admin_login_fails_when_password_is_not_configured(): void
    {
        config([
            'archive.admin.password' => '',
            'archive.admin.password_hash' => '',
        ]);

        $this->postJson('/api/admin/login', ['password' => 'secret'])
            ->assertStatus(503)
            ->assertJsonPath('message', 'Admin password is not configured');
    }

    public function test_admin_login_accepts_plain_password_and_logout_removes_token(): void
    {
        config([
            'archive.admin.password' => 'secret',
            'archive.admin.password_hash' => '',
            'archive.admin.token_ttl_minutes' => 30,
        ]);

        $response = $this->postJson('/api/admin/login', ['password' => 'secret'])
            ->assertOk()
            ->assertJsonPath('expires_in_minutes', 30);

        $token = $response->json('token');

        $this->assertNotEmpty($token);
        $this->assertTrue((bool) Cache::get('admin-token:'.$token));

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/admin/logout')
            ->assertOk();

        $this->assertNull(Cache::get('admin-token:'.$token));
    }

    public function test_admin_login_accepts_hashed_password(): void
    {
        config([
            'archive.admin.password' => '',
            'archive.admin.password_hash' => Hash::make('secret'),
            'archive.admin.token_ttl_minutes' => 15,
        ]);

        $this->postJson('/api/admin/login', ['password' => 'secret'])
            ->assertOk()
            ->assertJsonPath('expires_in_minutes', 15)
            ->assertJsonStructure(['token']);
    }
}
