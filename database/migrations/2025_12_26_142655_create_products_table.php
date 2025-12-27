<?php

use App\Models\User;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('price');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->foreignIdFor(User::class, 'seller_id');
            $table->foreignIdFor(Order::class, 'order_id')->nullable();
            $table->foreignIdFor(Cart::class, 'cart_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
