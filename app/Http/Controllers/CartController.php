<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use PhpParser\Node\Stmt\TryCatch;

class CartController extends Controller
{

    public function store(Request $request)
    {
        $attributes = $request->validate([
            'operation' => ['required', 'in:add,deduct,remove'],

            'items' => ['required_if:operation,add,deduct', 'array'],
            'items.*.id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],

            'id' => ['required_if:operation,remove', 'exists:products,id'],
        ]);

        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id(),
        ]);

        try {
            match ($attributes['operation']) {
                'remove' => $cart->removeProduct($attributes['id']),
                'add' => collect($attributes['items'])
                    ->each(fn ($item) => $cart->addProduct($item['id'], $item['quantity'])),
                'deduct' => collect($attributes['items'])
                    ->each(fn ($item) => $cart->deductProduct($item['id'], $item['quantity'])),
            };
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Cart updated!');
    }


    public function index()
    {
        
        return Inertia::render('Cart/Index', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
