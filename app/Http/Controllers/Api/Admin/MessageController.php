<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;

class MessageController extends Controller
{
    public function index()
    {
        return Message::latest()->get();
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json(['message' => 'Message deleted']);
    }
}
