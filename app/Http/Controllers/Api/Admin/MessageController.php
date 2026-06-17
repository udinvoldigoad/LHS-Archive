<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Support\ArchiveCache;

class MessageController extends Controller
{
    public function index()
    {
        return Message::latest()->get();
    }

    public function destroy(Message $message)
    {
        $message->delete();
        ArchiveCache::forgetPublic();

        return response()->json(['message' => 'Message deleted']);
    }
}
