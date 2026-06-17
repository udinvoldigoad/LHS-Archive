<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Link;
use App\Models\Member;
use App\Models\Message;
use App\Models\Moment;
use App\Models\Photo;
use App\Models\Setting;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'stats' => [
                'links' => Link::count(),
                'moments' => Moment::count(),
                'photos' => Photo::count(),
                'members' => Member::count(),
                'messages' => Message::count(),
            ],
            'settings' => Setting::first(),
            'categories' => Category::orderBy('name')->get(),
            'links' => Link::with('category')->orderBy('sort_order')->orderBy('id')->get(),
            'moments' => Moment::with('photos')->orderBy('id')->get(),
            'members' => Member::orderBy('sort_order')->orderBy('id')->get(),
            'messages' => Message::latest()->get(),
        ]);
    }
}
