<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! $this->adminPasswordIsConfigured()) {
            return response()->json(['message' => 'Admin password is not configured'], 503);
        }

        if (! $this->passwordIsValid((string) $request->password)) {
            return response()->json(['message' => 'Invalid password'], 422);
        }

        $token = Str::random(64);
        $tokenHash = hash('sha256', $token);
        $ttlMinutes = max(1, (int) config('archive.admin.token_ttl_minutes', 480));

        Cache::put('admin-token:'.$tokenHash, true, now()->addMinutes($ttlMinutes));

        return response()->json([
            'message' => 'Logged in',
            'token' => $token,
            'expires_in_minutes' => $ttlMinutes,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            Cache::forget('admin-token:'.hash('sha256', $token));
        }

        return response()->json(['message' => 'Logged out']);
    }

    private function adminPasswordIsConfigured(): bool
    {
        return $this->configuredHash() !== '' || ($this->plainPasswordIsAllowed() && $this->configuredPlainPassword() !== '');
    }

    private function passwordIsValid(string $password): bool
    {
        $hash = $this->configuredHash();

        if ($hash !== '') {
            return Hash::check($password, $hash);
        }

        return $this->plainPasswordIsAllowed() && hash_equals($this->configuredPlainPassword(), $password);
    }

    private function configuredHash(): string
    {
        return trim((string) config('archive.admin.password_hash', ''));
    }

    private function configuredPlainPassword(): string
    {
        return (string) config('archive.admin.password', '');
    }

    private function plainPasswordIsAllowed(): bool
    {
        return ! app()->isProduction() || (bool) config('archive.admin.allow_plain_password', false);
    }
}
