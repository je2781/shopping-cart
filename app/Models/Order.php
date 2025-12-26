<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        'items',
        'total',
        'user_id',
        'status',
    ];

    protected $casts = [
        'items' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(Product::class);
    }
}
