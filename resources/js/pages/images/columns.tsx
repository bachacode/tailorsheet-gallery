import { ColumnDef } from "@tanstack/react-table";
import { Check, Clipboard, Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { formatFileSize } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Link } from "@inertiajs/react";

// This type is used to define the shape of our data.
export type Image = {
  id: number;
  title: string;
  description: string;
  filename: string;
  size: number;
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
          <div className="flex items-center space-x-2">
            <img
              src={`/storage/images/${image.filename}`}
              alt={image.title}
              className="object-cover"
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
      id: "clipboard_action",
      cell: ({ row }) => {
        const image = row.original;
        const isCopied = copiedState[image.id] || false; // Check if this row is copied

        return (
          <Button
            variant="ghost"
            className="flex items-center px-1 max-w-[150px] truncate cursor-pointer ml-6`"
            onClick={() => handleCopy(image.id, image.filename)} // Call the handler
            aria-label="Copy file path"
          >
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
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const image = row.original;

        return (
          <div className="flex space-x-2">
            {/* Edit Button */}
            <Link aria-label="Editar" href={`/images/${image.id}/edit`} className="h-8 w-8 p-0 cursor-pointer">
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
