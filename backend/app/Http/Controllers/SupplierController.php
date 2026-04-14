<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function customers(Request $request)
    {
        $customers = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('users', 'users.id', '=', 'orders.user_id')
            ->where('order_items.supplier_id', $request->user()->id)
            ->select([
                'users.id as customer_id',
                'users.name as customer_name',
                'users.email as customer_email',
                'order_items.product_name',
                'order_items.quantity',
                'order_items.price',
                'orders.created_at as purchased_at',
            ])
            ->orderByDesc('orders.created_at')
            ->get();

        return response()->json($customers);
    }
}
