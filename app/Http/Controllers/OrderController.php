<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{
    public function store()
    {
        $attributes = request()->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'total' => ['required', 'numeric', 'min:0'],
        ]);

        $order = Order::firstOrCreate([
            'user_id' => Auth::id(),
            'status' => 'paid',
            'total_price' => $attributes['total'],
        ]);

        $orderItems = $order->items();

        if ($orderItems->isEmpty()) {
            foreach ($attributes['items'] as $item) {
                $order->items()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }
        
        }


        return redirect()->route('home')->with('success', 'Order placed successfully!');
    }
}
