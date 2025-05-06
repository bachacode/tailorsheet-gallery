import { ColumnDef } from "@tanstack/react-table";
import { Edit, LucideEye, LucideImage, LucidePlus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/common/data-table-column-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Link } from "@inertiajs/react";
import { Tag } from "../tags/columns";
import { Image as ImageType } from "../images/columns";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
export type Album = {
  id: number;
  title: string;
  description: string;
  cover_image?: string;
  tags: Tag[];
  images: ImageType[];
  images_count: number;
  created_at: string;
};

export const createColumns = (
  handleDelete: (id: number) => void
): ColumnDef<Album>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      id: "image",
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Imagen" />
      ),
      cell: ({ row }) => {
        const album = row.original;
        let imagePath = '';
        if(album.cover_image && album.cover_image.length > 0) {
          imagePath = `/storage/images/${album.cover_image}`
        } else if(album.images.length > 0) {
          imagePath = `/storage/images/${album.images[0].filename}`
        } else {
          imagePath = '/landscape-preview.svg'
        }
        return (
          <div className="flex items-center space-x-2">
            <img
              src={imagePath}
              className="object-contain aspect-square h-40 my-3 p-0.5 border rounded-md"
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
                e.currentTarget.src = "/landscape-placeholder.svg"; // Your fallback image path
              }}
            />
          </div>
        );
      }
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Titulo" />
      ),
      cell: ({ row }) => {
        const album = row.original;
        return (
          <div className="max-w-[150px] truncate py-1.5" title={album.title}>
            {album.title.length > 50
              ? `${album.title.slice(0, 50)}...`
              : album.title}
          </div>
        );
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descripción" />
      ),
      cell: ({ row }) => {
        const album = row.original;
        return (
          <div className="max-w-[150px] truncate">
          {album.description ?
            ( <span title={album.description}>{album.description}</span>) :
            (<span className="text-gray-600">Sin descripción...</span>)
          }
        </div>
        );
      },
    },
    {
      id: "images_count",
      accessorKey: "images_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Imagenes Totales" />
      ),
      cell: ({ row }) => {
        const album = row.original;
        return (
          <div className="flex items-center space-x-1.5">
            <LucideImage className="h-4 w-4"></LucideImage>
            <span>{album.images_count}</span>
          </div>
        );
      }
    },
    {
      id: "images_count_table",
      accessorKey: "images_count_table",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Imagenes Totales" />
      ),
      cell: ({ row }) => {
        const album = row.original;
        return (
          <div className="flex items-center space-x-1.5">
            <span>{album.images_count}</span>
            <span>Imagenes</span>
          </div>
        );
      }
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Etiquetas" />
      ),
      cell: ({ row }) => {
        const album = row.original;
        return (
          <div className="flex max-w-[150px] flex-wrap gap-2">
            {album.tags.map((tag) => (
              <Badge>{tag.name}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subido en" />
      ),
      cell: ({ row }) => {
        const album = row.original;

        // Format the date to DD/MM/YYYY
        const formattedDate = new Date(album.created_at).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return (
          <div className="max-w-[150px] truncate" title={formattedDate}>
            {formattedDate}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const album = row.original;
        return (
          <div className="flex space-x-1">

            {/* Add Button */}
            <Link aria-label="Añadir" href={route('albums.add', { id: album.id })} className="h-8 w-8 p-0 cursor-pointer">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <span className="sr-only">Añadir</span>
              <LucidePlus className="h-4 w-4 text-muted-foreground" />
            </Button>
            </Link>

            {/* View Button */}
            <Link aria-label="Ver" href={route('albums.show', { id: album.id })} className="h-8 w-8 p-0 cursor-pointer">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <span className="sr-only">Ver</span>
              <LucideEye className="h-4 w-4 text-muted-foreground" />
            </Button>
            </Link>

            {/* Edit Button */}
            <Link aria-label="Editar" href={route('albums.edit', { id: album.id })} className="h-8 w-8 p-0 cursor-pointer">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <span className="sr-only">Editar</span>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            </Link>
            {/* Delete Button */}
            <ConfirmDialog
            dialogDescription={`Esta acción no se podrá revertir. Estás a punto de eliminar permanentemente el álbum ${album.title}. ¿Confirmas esta acción?`}
            handleConfirm={() => handleDelete(album.id)}>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 cursor-pointer text-red-500 hover:text-red-700"
                aria-label="Eliminar"
              >
                <span className="sr-only">Eliminar</span>
                <Trash className="h-4 w-4" />
              </Button>
            </ConfirmDialog>

          </div>
        );
      },
    },
  ];
