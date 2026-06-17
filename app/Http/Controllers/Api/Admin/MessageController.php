<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return Message::latest()->get();
    }

    public function updateVisibility(Request $request, Message $message)
    {
        $validated = $request->validate([
            'is_visible' => ['required', 'boolean'],
        ]);

        $message->update($validated);

        return response()->json($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json(['message' => 'Message deleted']);
    }
}
