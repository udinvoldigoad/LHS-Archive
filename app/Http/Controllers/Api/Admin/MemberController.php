<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Support\ArchiveCache;
use App\Support\ArchiveMedia;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        return Member::orderBy('sort_order')->orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $member = Member::create($this->validateMember($request));
        ArchiveCache::forgetPublic();

        return response()->json($member, 201);
    }

    public function show(Member $member)
    {
        return $member;
    }

    public function update(Request $request, Member $member)
    {
        $oldPhotoUrl = $member->photo_url;
        $oldThumbnailUrl = $member->thumbnail_url;
        $validated = $this->validateMember($request);

        $member->update($validated);
        ArchiveMedia::deleteIfChanged($oldPhotoUrl, $member->photo_url);
        ArchiveMedia::deleteIfChanged($oldThumbnailUrl, $member->thumbnail_url);
        ArchiveCache::forgetPublic();

        return response()->json($member);
    }

    public function destroy(Member $member)
    {
        ArchiveMedia::delete($member->photo_url);
        ArchiveMedia::delete($member->thumbnail_url);
        $member->delete();
        ArchiveCache::forgetPublic();

        return response()->json(['message' => 'Member deleted']);
    }

    private function validateMember(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'nickname' => ['nullable', 'string', 'max:120'],
            'role' => ['nullable', 'string', 'max:160'],
            'quote' => ['nullable', 'string', 'max:500'],
            'photo_url' => ['nullable', 'string', 'max:2048', ArchiveMedia::rule()],
            'thumbnail_url' => ['nullable', 'string', 'max:2048', ArchiveMedia::rule()],
            'instagram_url' => ['nullable', 'url', 'max:2048'],
            'fun_fact' => ['nullable', 'string', 'max:800'],
            'sort_order' => ['integer', 'min:0'],
        ]);
    }
}
