<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Moment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MomentController extends Controller
{
    public function index()
    {
        return Moment::with('photos')->orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $validated = $this->validateMoment($request);
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        return response()->json(Moment::create($validated)->load('photos'), 201);
    }

    public function show(Moment $moment)
    {
        return $moment->load('photos');
    }

    public function update(Request $request, Moment $moment)
    {
        $validated = $this->validateMoment($request, $moment);
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $moment->update($validated);

        return response()->json($moment->load('photos'));
    }

    public function destroy(Moment $moment)
    {
        $moment->delete();

        return response()->json(['message' => 'Moment deleted']);
    }

    private function validateMoment(Request $request, ?Moment $moment = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:1000'],
            'slug' => [
                'nullable',
                'string',
                'max:220',
                Rule::unique('moments', 'slug')->ignore($moment),
            ],
        ]);
    }
}
