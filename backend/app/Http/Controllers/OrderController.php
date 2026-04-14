<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function history(Request $request)
    {
        $orders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->get();

        return response()->json($orders);
    }

    public function checkout(Request $request)
    {
        $cart = Cart::with('items.product')
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $order = DB::transaction(function () use ($cart, $request) {
            $total = 0;

            foreach ($cart->items as $item) {
                if ($item->product->stock < $item->quantity) {
                    abort(422, "Insufficient stock for {$item->product->name}");
                }

                $total += $item->product->price * $item->quantity;
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $total,
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'supplier_id' => $item->product->supplier_id,
                    'product_name' => $item->product->name,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            $cart->items()->delete();

            return $order->load('items');
        });

        return response()->json($order, 201);
    }
}
