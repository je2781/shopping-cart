<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


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

         DB::transaction(function () use ($attributes) {

             $order = Order::Create([
                 'user_id' => Auth::id(),
                 'status' => 'paid',
                 'total_price' => $attributes['total'],
             ]);
     
     
             if (! $order->items()->exists()) {
                 foreach ($attributes['items'] as $item) {
                     $order->items()->create([
                         'product_id' => $item['id'],
                         'quantity' => $item['quantity'],
                         'price' => $item['price'],
                     ]);
                 }
             
             }
     
             //delete user cart after order is placed
             $user = $order->user;
     
             if ($user && $user->cart) {
                 $user->cart->items()->delete();
                 $user->cart()->delete();
             }
             

         });



        return redirect()->route('home')->with('success', 'Order placed successfully!');
    }
}
