<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['supplier_id', 'name', 'description', 'price', 'stock'])]
class Product extends Model
{
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
}
