import { ColumnDef } from "@tanstack/react-table";
import { Check, Clipboard, Edit, LucideDownload, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/common/data-table-column-header";
import { formatFileSize } from "@/lib/utils";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Link } from "@inertiajs/react";
import { Tag } from "../tags/columns";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
export type Image = {
  id: number;
  title: string;
  description: string;
  filename: string;
  size: number;
  tags: Tag[];
  created_at: string;
};

export const createColumns = (
  copiedState: Record<number, boolean>, // State map for copied rows
  handleCopy: (id: number, filename: string) => void, // Copy handler function
  handleDelete: (id: number) => void
): ColumnDef<Image>[] => [
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
        const image = row.original;
        return (
          <Link href={route('images.edit', image.id)}>
            <img
              src={`/storage/images/${image.filename}`}
              alt={image.title}
              className="object-contain aspect-square h-40 my-3 p-0.5 border rounded-md"
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
                e.currentTarget.src = "/landscape-placeholder.svg"; // Your fallback image path
              }}
            />
          </Link>
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
        const image = row.original;
        return (
          <div className="max-w-[150px] truncate" title={image.title}>
            {image.title.length > 50
              ? `${image.title.slice(0, 50)}...`
              : image.title}
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
        const image = row.original;
        return (
          <div className="max-w-[150px] truncate">
            {image.description ?
              (<span title={image.description}>{image.description}</span>) :
              (<span className="text-gray-600">Sin descripción...</span>)
            }
          </div>
        );
      },
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Etiquetas" />
      ),
      cell: ({ row }) => {
        const image = row.original;
        return (
          <div className="flex max-w-[150px] flex-wrap gap-2">
            {image.tags.map((tag) => (
              <Badge>{tag.name}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "filename",
      accessorKey: "filename",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre del archivo" />
      ),
      cell: ({ row }) => {
        const image = row.original;
        const isCopied = copiedState[image.id] || false; // Check if this row is copied

        return (
          <Button
            variant="ghost"
            className="flex items-center px-1 max-w-[150px] truncate cursor-pointer"
            onClick={() => handleCopy(image.id, image.filename)} // Call the handler
            aria-label="Copy file path"
          >
            <span className="truncate" title={image.filename}>
              {image.filename.length > 50
                ? `${image.filename.slice(0, 50)}...`
                : image.filename}
            </span>
            {isCopied ? (
              <span className="text-green-500">
                <Check className="h-4 w-4" />
              </span>
            ) : (
              <span>
                <Clipboard className="h-4 w-4 text-muted-foreground" />
              </span>
            )}
          </Button>
        );
      },
    },
    {
      id: "size",
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tamaño" />
      ),
      cell: ({ row }) => {
        const image = row.original;
        return (
          <div className="max-w-[150px] truncate" title={`${image.size} bytes`}>
            {formatFileSize(image.size)}
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
        const image = row.original;

        // Format the date to DD/MM/YYYY
        const formattedDate = new Date(image.created_at).toLocaleDateString("es-ES", {
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
        const image = row.original;
        const isCopied = copiedState[image.id] || false; // Check if this row is copied
        return (
          <div className="flex space-x-0.5">

            {/* Copy Button */}
            <Button
              variant="ghost"
              className="flex items-center px-1 h-8 w-8 p-0 cursor-pointer"
              onClick={() => handleCopy(image.id, image.filename)} // Call the handler
              aria-label="Copiar ruta del archivo"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Clipboard className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            {/* Download Button */}
            <Button
              variant="ghost"
              className="flex items-center px-1 h-8 w-8 p-0 cursor-pointer"
              aria-label="Descargar archivo"
              asChild
            >
              <a href={`/storage/images/${image.filename}`} download={image.filename}>
                <LucideDownload className="h-4 w-4 text-muted-foreground" />
              </a>
            </Button>

            {/* Edit Button */}
            <Link aria-label="Editar" href={route('images.edit', { id: image.id })} className="h-8 w-8 p-0 cursor-pointer">
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
              dialogDescription={`Esta acción no se podrá revertir. Estás a punto de eliminar permanentemente la imagen ${image.title}. ¿Confirmas esta acción?`}
              handleConfirm={() => handleDelete(image.id)}>
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
