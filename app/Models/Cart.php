<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //
    protected $fillable = [
        'quantity',
        'items',
        'total_price',
        'user_id',
    ];

    protected $casts = [
        'items' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(Product::class);
    }
}
