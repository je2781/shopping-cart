<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;



Route::get('/cart', [CartController::class, 'index'])
->name('cart.index');
Route::middleware(['auth', 'verified'])->get('/', [ProductController::class, 'index'])->name('home');
Route::middleware(['auth'])->post('/cart', [CartController::class, 'store'])
->name('cart.store');
Route::middleware(['auth'])->post('/checkout', [OrderController::class, 'store'])
->name('order.store');

Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/login');
})->name('logout');


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
