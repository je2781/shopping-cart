<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'price',
        'name',
        'user_id',
        'description',
        'image_path',
        'stock_quantity',
    ];

    
}
