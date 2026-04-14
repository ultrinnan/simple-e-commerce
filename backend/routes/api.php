<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:supplier')->group(function () {
        Route::get('/supplier/products', [ProductController::class, 'supplierIndex']);
        Route::post('/supplier/products', [ProductController::class, 'store']);
        Route::put('/supplier/products/{product}', [ProductController::class, 'update']);
        Route::delete('/supplier/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/supplier/customers', [SupplierController::class, 'customers']);
    });

    Route::middleware('role:customer')->group(function () {
        Route::get('/cart', [CartController::class, 'show']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::put('/cart/items/{item}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
        Route::post('/checkout', [OrderController::class, 'checkout']);
        Route::get('/orders', [OrderController::class, 'history']);
    });
});
