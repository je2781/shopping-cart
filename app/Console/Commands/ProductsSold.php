<?php

namespace App\Console\Commands;
use App\Models\Order;
use App\Models\User;
use App\Mail\DailySalesReportMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

use Illuminate\Console\Command;

class ProductsSold extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:daily-sales';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily sales report to admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();

        $orders = Order::with('items.product')
            ->whereDate('created_at', $today)
            ->where('status', 'paid') // adjust if needed
            ->get();

        if ($orders->isEmpty()) {
            $this->info('No sales today.');
            return;
        }

        // Dummy admin user
        $admin = User::where('email', 'admin@example.com')->first();

        if (!$admin) {
            $this->error('Admin user not found.');
            return;
        }

        Mail::to($admin->email)->send(
            new DailySalesReportMail(
                $orders->map(function ($order) {
                    return [
                        'id' => (int) $order->id,
                        'customer_name' => optional($order->user)->name,
                        'total' => (float) $order->total_price,
                        'items' => $order->items->map(function ($item) {
                            $product = $item->product;

                            return [
                                'name' => (string) $product->name,
                                'price' => (float) $item->price,
                                'quantity' => (int) $item->quantity,
                                'image_url' => (string) $product->image_path,
                            ];
                        })->toArray(),
                    ];
                })->toArray(),
                $today
            )
        );


        $this->info('Daily sales report sent successfully.');
    }
}
