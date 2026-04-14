<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $cart = $this->getOrCreateCart($request->user()->id);
        $cart->load('items.product');

        return response()->json($cart);
    }

    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock < $validated['quantity']) {
            return response()->json(['message' => 'Not enough stock'], 422);
        }

        $cart = $this->getOrCreateCart($request->user()->id);

        $item = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
        ]);

        $item->quantity = ($item->exists ? $item->quantity : 0) + $validated['quantity'];
        $item->save();

        return response()->json($item->load('product'), 201);
    }

    public function updateItem(Request $request, CartItem $item)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($item->product->stock < $validated['quantity']) {
            return response()->json(['message' => 'Not enough stock'], 422);
        }

        $item->update(['quantity' => $validated['quantity']]);

        return response()->json($item->load('product'));
    }

    public function removeItem(Request $request, CartItem $item)
    {
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'Removed']);
    }

    private function getOrCreateCart(int $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }
}
