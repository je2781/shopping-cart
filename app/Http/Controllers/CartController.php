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
          $atrributes = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'operation' => ['in:add,remove'],
        ]);

        // Add to cart logic
        foreach ($atrributes['items'] as $item) {
            $cart = Cart::firstOrCreate(
                ['user_id' => Auth::id()],
                ['items' => [], 'quantity' => 0, 'total_price' => 0]
            );

            if ($atrributes['operation'] === 'add') {
                $cart->addProduct($item['id'], $item['quantity']);
            } elseif ($atrributes['operation'] === 'remove') {
                $cart->deductProduct($item['id'], $item['quantity']);
            }
        }
  

        return back()->with('success', 'Cart updated successfully!');
    }

    public function index()
    {
        $cart = Cart::where('user_id', Auth::id())->with('items')->first();

        $cartItems = [];

        if( $cart ) {
            $cartItems = collect($cart->items)->map(function ($item) {
                $product = Product::find($item['product_id']);
                return [
                    'id' => (int) $item['product_id'],
                    'name' => (string) $product->name,
                    'price' => (float) $product->price,
                    'imageUrl' => (string) $product->image_path,
                    'stock' => (int) $product->stock_quantity,
                    'quantity' => (int) $item['quantity'],
                ];
            })->toArray();
        }

        return Inertia::render('cart', [
            'canRegister' => Features::enabled(Features::registration()),
            'cartItems' => $cartItems,
            'total' => $cart->getTotalAmount() ?? 0,
        ]);
    }
}
