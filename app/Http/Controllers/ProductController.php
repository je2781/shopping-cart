<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use Laravel\Fortify\Features;


class ProductController extends Controller
{
        /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all()->map(fn ($product) => [
            'id' => (int) $product->id,
            'name' => (string) $product->name,
            'price' => (float) $product->price,
            'stock' => (int) $product->stock_quantity,
            'imageUrl' => (string) $product->image_path,
            'description' => (string) $product->description,
        ])->toArray();
        
        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'products' => $products,
        ]);

    }
}
