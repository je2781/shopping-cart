<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'cart' => function () {
                if (!Auth::check()) {
                    return null;
                }

                $cart = Cart::with('items.product')
                    ->where('user_id', Auth::id())
                    ->first();

                if (!$cart) {
                    return [
                        'items' => [],
                        'count' => 0,
                        'total' => 0,
                    ];
                }

                return [
                    'items' => $cart->items->map(fn ($item) => [
                        'id' => $item->product_id,
                        'name' => $item->product?->name ?? 'Unknown',
                        'quantity' => $item->quantity,
                        'imageUrl' => $item->product?->image_path ?? null,
                        'stock' => (int) ($item->product?->stock_quantity ?? 0),
                        'price' => (float) ($item->product?->price ?? 0),
                    ])->values(),
                    'count' => $cart->items->count(),
                    'total' => $cart->recalculateTotals(),
                ];
            },
        ]);

    }
}
