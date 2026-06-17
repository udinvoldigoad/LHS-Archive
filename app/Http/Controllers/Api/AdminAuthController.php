<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! hash_equals((string) env('ADMIN_PASSWORD'), $request->password)) {
            return response()->json(['message' => 'Invalid password'], 422);
        }

        $token = Str::random(64);

        Cache::put('admin-token:'.$token, true, now()->addHours(8));

        return response()->json([
            'message' => 'Logged in',
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            Cache::forget('admin-token:'.$token);
        }

        return response()->json(['message' => 'Logged out']);
    }
}
