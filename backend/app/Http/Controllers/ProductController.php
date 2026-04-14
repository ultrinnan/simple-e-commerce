<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(
            Product::with('supplier:id,name,email')
                ->orderByDesc('id')
                ->get()
        );
    }

    public function supplierIndex(Request $request)
    {
        return response()->json(
            Product::where('supplier_id', $request->user()->id)
                ->orderByDesc('id')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0.01'],
            'stock' => ['required', 'integer', 'min:0'],
        ]);

        $product = Product::create([
            ...$validated,
            'supplier_id' => $request->user()->id,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->supplier_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0.01'],
            'stock' => ['sometimes', 'integer', 'min:0'],
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($product->supplier_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
