<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable as FoundationQueueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\LowStockMail;

class ProductStockLowJob implements ShouldQueue
{
    use FoundationQueueable;

    protected int $productId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $productId)
    {
        $this->productId = $productId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $product = Product::find($this->productId);

        if (! $product) {
            return;
        }

        // Only notify when stock is less than or equal to 3
        if ((int) $product->stock_quantity > 3) {
            return;
        }

        // Get admin user
        $admin = User::where('email', 'admin@example.com')->first();

        if (! $admin) {
            Log::warning('Admin user not found for low stock notification.');
            return;
        }

        Mail::to($admin->email)->send(
            new LowStockMail($product)
        );
    }
}
