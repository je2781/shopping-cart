<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::middleware(['auth', 'verified'])->get('/', [ProductController::class, 'index'])->name('home');

Route::middleware(['auth'])->post('/cart', [CartController::class, 'store'])
->name('cart.store');
Route::get('/cart', [CartController::class, 'index'])
    ->name('cart');
Route::middleware(['auth'])->post('/checkout', [OrderController::class, 'store'])
->name('order.store');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
