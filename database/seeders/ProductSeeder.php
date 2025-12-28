<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Factories\Sequence;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Product::factory(12)->create(new Sequence([
            'name' => 'Basic Tee',
            'price' => 32.00,
            'image_path' => 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
        ],
        [
            'name' => 'Artwork Tee',
            'price' => 29.99,
            'image_path' => 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg',
        ],
        [
            'name' => 'Basic Tee',
            'price' => 32.00,   
            'image_path' => 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg',
        ],
        [
            'name' => 'Artwork Tee',
            'price' => 49.99,
            'image_path' => 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg',
        ]));
    }
}
