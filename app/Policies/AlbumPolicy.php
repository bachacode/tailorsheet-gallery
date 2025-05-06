<?php

namespace App\Policies;

use App\Models\Album;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AlbumPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Album $album): Response
    {
        return $user->id === $album->user_id
        ? Response::allow()
        : Response::deny('No tienes permitido ver este álbum');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Album $album): Response
    {
        return $user->id === $album->user_id
        ? Response::allow()
        : Response::deny('No tienes permitido editar este álbum');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Album $album): Response
    {
        return $user->id === $album->user_id
            ? Response::allow()
            : Response::deny('No tienes permitido eliminar este álbum');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Album $album): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Album $album): Response
    {
        return $user->id === $album->user_id
            ? Response::allow()
            : Response::deny('No tienes permitido eliminar este álbum');
    }
}
