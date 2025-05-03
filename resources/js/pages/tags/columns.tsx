import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/common/data-table-column-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EditDialog } from "./edit-dialog";

// This type is used to define the shape of our data.
export type Tag = {
  id: number;
  name: string;
  created_at: string;
};

export const createColumns = (
  handleDelete: (id: number) => void,
): ColumnDef<Tag>[] => [
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
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Titulo" />
      ),
      cell: ({ row }) => {
        const image = row.original;
        return (
          <div className="max-w-[150px] truncate" title={image.name}>
            {image.name.length > 50
              ? `${image.name.slice(0, 50)}...`
              : image.name}
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
        const tag = row.original;

        return (
          <div className="flex space-x-2">
            {/* Edit Button */}
            <EditDialog id={tag.id} name={tag.name}></EditDialog>
            {/* Delete Button */}
            <ConfirmDialog
              dialogDescription={`Esta acción no se podrá revertir. Estás a punto de eliminar permanentemente la etiqueta ${tag.name}. ¿Confirmas esta acción?`}
              handleConfirm={() => handleDelete(tag.id)}
            >
              <span
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent has-[>svg]:px-3 cursor-pointer"
                aria-label="Eliminar"
              >
                <span className="sr-only">Eliminar</span>
                <Trash className="h-4 w-4" />
              </span>
            </ConfirmDialog>
          </div>
        );
      },
    },
  ];
