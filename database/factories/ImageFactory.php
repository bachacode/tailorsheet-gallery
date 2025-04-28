<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Generate a user if not provided
            'title' => $this->faker->sentence(3), // Generate a title
            'description' => $this->faker->paragraph(), // Generate a description
            'filename' => 'images/' . $this->faker->unique()->word() . '.jpg', // Generate a unique filename
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
