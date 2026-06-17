<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Link;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    public function index()
    {
        return Link::with('category')->orderBy('sort_order')->orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $link = Link::create($this->validateLink($request));

        return response()->json($link->load('category'), 201);
    }

    public function show(Link $link)
    {
        return $link->load('category');
    }

    public function update(Request $request, Link $link)
    {
        $link->update($this->validateLink($request));

        return response()->json($link->load('category'));
    }

    public function destroy(Link $link)
    {
        $link->delete();

        return response()->json(['message' => 'Link deleted']);
    }

    private function validateLink(Request $request): array
    {
        return $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:800'],
            'url' => ['required', 'url', 'max:2048'],
            'thumbnail_url' => ['nullable', 'url', 'max:2048'],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);
    }
}
