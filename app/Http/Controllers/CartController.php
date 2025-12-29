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
            'operation' => ['in:add,deduct,remove'],
        ]);

        // Add to cart logic
        $cart = Cart::firstOrCreate(
            ['user_id' => Auth::id()],
        );

        foreach ($atrributes['items'] as $item) {

            if ($atrributes['operation'] === 'add') {
                $cart->addProduct($item['id'], $item['quantity']);
            } elseif ($atrributes['operation'] === 'deduct') {
                $cart->deductProduct($item['id'], $item['quantity']);
            }else{
                $cart->removeProduct($item['id']);
            }
        }
  

         return response()->json(['success' => true]);

    }

    public function index()
    {
        $cart = Cart::where('user_id', Auth::id())->with('items.product')->first();

        $cartItems = [];

        if( $cart ) {
            $cartItems = $cart->items->map(function ($item) {
                $product = $item->product;
                return [
                    'id' => (int) $item->product_id,
                    'name' => (string) $product->name,
                    'price' => (float) $product->price,
                    'imageUrl' => (string) $product->image_path,
                    'stock' => (int) $product->stock_quantity,
                    'quantity' => (int) $item->quantity,
                ];
            })->toArray();
        }

        return Inertia::render('cart', [
            'canRegister' => Features::enabled(Features::registration()),
            'cartItems' => $cartItems,
            'total' => $cart->recalculateTotals(),
        ]);
    }
}
