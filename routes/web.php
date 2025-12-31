<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;



Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index'])
        ->name('cart.index');

    Route::post('/cart', [CartController::class, 'store'])
        ->name('cart.store');
});

Route::middleware('auth')->get('/', [ProductController::class, 'index'])->name('ecommerce.home');
Route::middleware('auth')->post('/checkout', [OrderController::class, 'store'])
->name('order.store');

Route::post('/logout', function () {
    Auth::logout();

    return redirect('/login');
})->middleware('auth')->name('logout');


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
