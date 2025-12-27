<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'description' => $this->faker->optional()->paragraph(),
            'image_path' => $this->faker->optional()->imageUrl(),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'seller_id' => \App\Models\User::factory(),
        ];
    }
}
