<?php

namespace App\Policies;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TagPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Tag $tag): Response
    {
        return $user->id === $tag->user_id
            ? Response::allow()
            : Response::deny('No tienes permitido editar esta etiqueta');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Tag $tag): Response
    {
        return $user->id === $tag->user_id
        ? Response::allow()
        : Response::deny('No tienes permitido eliminar esta etiqueta');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Tag $tag): Response
    {
        return $user->id === $tag->user_id
        ? Response::allow()
        : Response::deny('No tienes permitido eliminar esta etiqueta');
    }
}
