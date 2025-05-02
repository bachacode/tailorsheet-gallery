<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
    ];

    /** @use HasFactory<\Database\Factories\TagFactory> */
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(Image::class, 'images_tags');
    }

    public function albums(): BelongsToMany
    {
        return $this->belongsToMany(Album::class, 'albums_tags');
    }
}
