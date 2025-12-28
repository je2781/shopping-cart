<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Jobs\ProductStockLowJob;
use Illuminate\Support\Facades\DB;

class Cart extends Model
{
    protected $fillable = [
        'quantity',      // number of different products in cart
        'items',         // JSON array of items: [{ product_id, quantity }]
        'total_price',   // total price of cart
        'user_id',
    ];

    protected $casts = [
        'items' => 'array',
    ];

    public function getTotalAmount(): float
    {
        return $this->total_price;
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Add a product to the cart.
     * Only increases `quantity` if it's a new product.
     */
    public function addProduct(int $productId, int $quantity = 1): void
    {
        DB::transaction(function () use ($productId, $quantity) {

            $product = Product::lockForUpdate()->find($productId);

            if (! $product) {
                throw new \Exception('Product not found');
            }

            if ($product->stock_quantity < $quantity) {
                throw new \Exception('Not enough stock available');
            }

            $items = $this->items ?? [];

            $index = collect($items)->search(
                fn ($item) => $item['product_id'] === $productId
            );

            if ($index === false) {
                // New product → add to cart
                $items[] = [
                    'product_id' => $productId,
                    'quantity'   => $quantity,
                ];
            } else {
                // Existing product → increment quantity
                $items[$index]['quantity'] += $quantity;
            }

            // Deduct stock
            $product->decrement('stock_quantity', $quantity);

            // Dispatch job when stock becomes 3 or less
            if ($product->stock_quantity <= 3) {
                ProductStockLowJob::dispatch($product->id);
            }

            $this->items = $items;
            $this->recalculateTotals();
            $this->save();
        });
    }

    /**
     * Deduct quantity of a product and remove if quantity <= 0.
     */
    public function deductProduct(int $productId, int $quantity = 1): void
    {
        $items = $this->items ?? [];

        $index = collect($items)->search(fn($i) => $i['product_id'] === $productId);

        if ($index !== false) {
            $items[$index]['quantity'] -= $quantity;

            if ($items[$index]['quantity'] <= 0) {
                // Remove product completely
                array_splice($items, $index, 1);
            }

            $this->items = $items;
            $this->recalculateTotals();
            $this->save();
        }
    }

    /**
     * Recalculate total price and number of different products.
     */
    protected function recalculateTotals(): void
    {
        $totalPrice = 0;
        $items = $this->items ?? [];

        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $totalPrice += $product->price * $item['quantity'];
            }
        }

        $this->quantity = count($items); // number of different products
        $this->total_price = $totalPrice;
    }
}
