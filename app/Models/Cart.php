<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Jobs\ProductStockLowJob;
use Illuminate\Support\Facades\DB;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
    ];



    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'cart_items')
                    ->withPivot('quantity');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Add a product to the cart.
     * Only increases `quantity` if it's a new product.
     */
    public function addProduct(int $productId, int $quantity = 1): void
    {
        DB::transaction(function () use ($productId, $quantity) {

            // Lock the product row to prevent race conditions
            $product = Product::lockForUpdate()->find($productId);

            if (! $product) {
                throw new \Exception('Product not found');
            }

            if ($product->stock_quantity < $quantity) {
                throw new \Exception('Not enough stock available');
            }

            // Check if the product is already in the cart
            $cartItem = $this->items()->where('product_id', $productId)->first();

            if ($cartItem) {
                // Increment existing quantity
                $cartItem->quantity += $quantity;
                $cartItem->save();
            } else {
                // Add new product to cart
                $this->items()->create([
                    'product_id' => $productId,
                    'quantity'   => $quantity,
                ]);
            }

            // Deduct stock
            $product->decrement('stock_quantity', $quantity);

            // Dispatch job when stock becomes 3 or less
            if ($product->stock_quantity <= 3) {
                ProductStockLowJob::dispatch($product->id);
            }

        });
    }

    /**
     * Deduct quantity of a product and remove if quantity <= 0.
     */
    public function deductProduct(int $productId, int $quantity = 1): void
    {
        DB::transaction(function () use ($productId, $quantity) {

            // Find the cart item
            $cartItem = $this->items()->where('product_id', $productId)->first();

            if (! $cartItem) {
                // Product not in cart, nothing to do
                return;
            }

            // Deduct the quantity
            $cartItem->quantity -= $quantity;
            
            if ($cartItem->quantity <= 0 ) {
                // Remove product completely from cart
                $cartItem->delete();
            } else{
                // Update quantity
                $cartItem->save();
            }

            // Restore stock
            $product = Product::find($productId);
            if ($product) {
                $product->increment('stock_quantity', $quantity);
            }
        });
    }

    public function removeProduct(int $productId): void
    {
        DB::transaction(function () use ($productId) {

            // Find the cart item
            $cartItem = $this->items()->where('product_id', $productId)->first();

            if (! $cartItem) {
                // Product not in cart, nothing to do
                return;
            }

            // Remove product completely from cart
            $cartItem->delete();

        });
    }


    /**
     * Recalculate total price and number of different products.
     */
    public function recalculateTotals(): float
    {
        return $this->items->sum(fn ($item) => $item->product ? $item->product->price * $item->quantity : 0);
    }

}
