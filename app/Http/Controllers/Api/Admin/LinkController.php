<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Link;
use App\Support\ArchiveMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LinkController extends Controller
{
    public function index()
    {
        return Link::with('category')->orderBy('sort_order')->orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $link = Link::create($this->linkData($request));

        return response()->json($link->load('category'), 201);
    }

    public function show(Link $link)
    {
        return $link->load('category');
    }

    public function update(Request $request, Link $link)
    {
        $oldThumbnailUrl = $link->thumbnail_url;
        $validated = $this->linkData($request);

        $link->update($validated);
        ArchiveMedia::deleteIfChanged($oldThumbnailUrl, $link->thumbnail_url);

        return response()->json($link->load('category'));
    }

    public function destroy(Link $link)
    {
        ArchiveMedia::delete($link->thumbnail_url);
        $link->delete();

        return response()->json(['message' => 'Link deleted']);
    }

    private function validateLink(Request $request): array
    {
        return $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'category_name' => ['nullable', 'string', 'max:120'],
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:800'],
            'url' => ['required', 'url', 'max:2048'],
            'thumbnail_url' => ['nullable', 'string', 'max:2048', ArchiveMedia::rule()],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);
    }

    private function linkData(Request $request): array
    {
        $validated = $this->validateLink($request);
        $categoryName = trim((string) ($validated['category_name'] ?? ''));
        $usesTypedCategory = $request->has('category_name');

        unset($validated['category_name']);

        if ($usesTypedCategory) {
            $validated['category_id'] = $categoryName !== '' ? $this->categoryIdFor($categoryName) : null;
        }

        return $validated;
    }

    private function categoryIdFor(string $name): int
    {
        $cleanName = preg_replace('/\s+/', ' ', trim($name));
        $slug = Str::slug($cleanName) ?: 'archive';
        $category = Category::firstOrCreate(
            ['slug' => $slug],
            ['name' => $cleanName],
        );

        return $category->id;
    }
}
