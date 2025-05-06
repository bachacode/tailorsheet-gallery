<?php

namespace App\Policies;

use App\Models\Image;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ImagePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Image $image): Response
    {
        return $user->id === $image->user_id
            ? Response::allow()
            : Response::deny('No tienes permitido ver esta imagen');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Image $image): Response
    {
        return $user->id === $image->user_id
            ? Response::allow()
            : Response::deny('No tienes permitido editar esta imagen');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Image $image): Response
    {
        return $user->id === $image->user_id
            ? Response::allow()
            : Response::deny('No tienes permitido eliminar esta imagen');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Image $image): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Image $image): Response
    {
        return $user->id === $image->user_id
            ? Response::allow()
            : Response::deny('No tienes permitido eliminar esta imagen');
    }
}
