<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Link;
use App\Models\Member;
use App\Models\Message;
use App\Models\Moment;
use App\Models\Setting;
use Illuminate\Http\Request;

class PublicArchiveController extends Controller
{
    public function archive()
    {
        return response()->json([
            'settings' => $this->settingsData(),
            'bestMoment' => $this->bestMomentData(),
            'categories' => Category::orderBy('name')->get(),
            'links' => $this->linksData(),
            'moments' => $this->momentsData(),
            'members' => $this->membersData(),
            'messages' => $this->messagesData(),
        ]);
    }

    public function settings()
    {
        return response()->json($this->settingsData());
    }

    public function links()
    {
        return response()->json($this->linksData());
    }

    public function categories()
    {
        return response()->json(Category::orderBy('name')->get());
    }

    public function moments()
    {
        return response()->json($this->momentsData());
    }

    public function moment(Moment $moment)
    {
        $moment->load(['photos']);

        return response()->json($this->formatMoment($moment));
    }

    public function members()
    {
        return response()->json($this->membersData());
    }

    public function messages()
    {
        return response()->json($this->messagesData());
    }

    public function storeMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'message' => ['required', 'string', 'max:500'],
        ]);

        $message = Message::create($validated + ['is_visible' => true]);

        return response()->json($message, 201);
    }

    private function settingsData(): array
    {
        $settings = Setting::first();

        return [
            'title' => $settings?->site_title ?? 'LHS Archive',
            'tagline' => $settings?->tagline ?? 'Tempat kecil buat nyimpen semua hal yang pernah rame bareng.',
            'adminPasswordConcept' => [
                'route' => '/admin',
                'envKey' => 'ADMIN_PASSWORD',
                'status' => 'Backend token auth enabled',
            ],
            'music' => [
                'title' => 'Play Memory',
                'url' => $settings?->background_music_url ?? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            ],
        ];
    }

    private function bestMomentData(): array
    {
        $settings = Setting::first();

        return [
            'label' => 'Featured',
            'title' => $settings?->best_moment_title ?? 'Malam Keakraban 2023',
            'description' => $settings?->best_moment_description ?? 'Satu video buat membuktikan kalau chaos juga bisa terlihat sinematik.',
            'thumbnailUrl' => 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=85',
            'videoUrl' => $settings?->best_moment_video_url ?? '',
        ];
    }

    private function linksData()
    {
        return Link::with('category')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Link $link) => [
                'id' => $link->id,
                'title' => $link->title,
                'description' => $link->description,
                'url' => $link->url,
                'thumbnailUrl' => $link->thumbnail_url,
                'category' => $link->category?->name ?? 'Archive',
                'categoryId' => $link->category_id,
                'buttonLabel' => 'Buka Link',
                'isFeatured' => $link->is_featured,
                'sortOrder' => $link->sort_order,
                'rotation' => $this->rotationFor($link->id),
            ]);
    }

    private function momentsData()
    {
        return Moment::with('photos')
            ->orderBy('id')
            ->get()
            ->map(fn (Moment $moment) => $this->formatMoment($moment));
    }

    private function formatMoment(Moment $moment): array
    {
        return [
            'id' => $moment->id,
            'title' => $moment->title,
            'description' => $moment->description,
            'slug' => $moment->slug,
            'caption' => $moment->photos->first()?->caption ?? $moment->description,
            'imageUrl' => $moment->photos->first()?->image_url,
            'rotation' => $moment->photos->first()?->rotation ?? $this->rotationFor($moment->id),
            'photos' => $moment->photos->map(fn ($photo) => [
                'id' => $photo->id,
                'title' => $moment->title,
                'caption' => $photo->caption,
                'imageUrl' => $photo->image_url,
                'rotation' => $photo->rotation,
                'sortOrder' => $photo->sort_order,
            ]),
        ];
    }

    private function membersData()
    {
        return Member::orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Member $member) => [
                'id' => $member->id,
                'name' => $member->name,
                'nickname' => $member->nickname,
                'role' => $member->role,
                'quote' => $member->quote,
                'photoUrl' => $member->photo_url,
                'instagramUrl' => $member->instagram_url,
                'funFact' => $member->fun_fact,
                'sortOrder' => $member->sort_order,
            ]);
    }

    private function messagesData()
    {
        return Message::where('is_visible', true)
            ->latest()
            ->get()
            ->map(fn (Message $message) => [
                'id' => $message->id,
                'name' => $message->name,
                'message' => $message->message,
                'isVisible' => $message->is_visible,
                'rotation' => $this->rotationFor($message->id),
            ]);
    }

    private function rotationFor(int $id): string
    {
        $rotations = ['-1.5deg', '1deg', '-0.5deg', '1.4deg', '-1deg', '0.8deg'];

        return $rotations[$id % count($rotations)];
    }
}
