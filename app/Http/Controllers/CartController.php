<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class CartController extends Controller
{

    public function store(Request $request)
    {
        $attributes = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'operation' => ['in:add,deduct,remove'],
        ]);

        // retrive user cart or create new one
        $cart = Cart::firstOrCreate(
            ['user_id' => Auth::id()],
        );


        foreach ($attributes['items'] as $item) {
            if ($attributes['operation'] === 'add') {
                $cart->addProduct($item['id'], $item['quantity']);
            } elseif ($attributes['operation'] === 'deduct') {
                $cart->deductProduct($item['id'], $item['quantity']);
            } else {
                $cart->removeProduct($item['id']);
            }
        }


        return redirect()->back()->with('success', 'Cart updated!');


    }


    public function index()
    {
        return Inertia::render('cart', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
