<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
    ];

    /** @use HasFactory<\Database\Factories\TagFactory> */
    use HasFactory;

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(Image::class, 'images_tags');
    }
}
