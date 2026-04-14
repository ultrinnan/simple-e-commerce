<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $supplier1 = User::create([
            'name' => 'Supplier One',
            'email' => 'supplier1@example.com',
            'password' => 'password',
            'role' => 'supplier',
        ]);

        $supplier2 = User::create([
            'name' => 'Supplier Two',
            'email' => 'supplier2@example.com',
            'password' => 'password',
            'role' => 'supplier',
        ]);

        User::create([
            'name' => 'Customer One',
            'email' => 'customer1@example.com',
            'password' => 'password',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'Customer Two',
            'email' => 'customer2@example.com',
            'password' => 'password',
            'role' => 'customer',
        ]);

        Product::create([
            'supplier_id' => $supplier1->id,
            'name' => 'Wireless Mouse',
            'description' => 'Comfortable wireless mouse',
            'price' => 29.99,
            'stock' => 25,
        ]);

        Product::create([
            'supplier_id' => $supplier1->id,
            'name' => 'Mechanical Keyboard',
            'description' => 'Tactile mechanical keyboard',
            'price' => 89.00,
            'stock' => 10,
        ]);

        Product::create([
            'supplier_id' => $supplier2->id,
            'name' => 'USB-C Hub',
            'description' => 'Multiport USB-C adapter',
            'price' => 49.50,
            'stock' => 15,
        ]);
    }
}
