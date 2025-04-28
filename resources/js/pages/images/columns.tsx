import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Clipboard, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

// This type is used to define the shape of our data.
export type Image = {
  id: number;
  title: string;
  description: string;
  filename: string;
  created_at: string;
};

export const createColumns = (
  copiedState: Record<number, boolean>, // State map for copied rows
  handleCopy: (id: number, filename: string) => void // Copy handler function
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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const image = row.original;
        return (
          <div className="max-w-[150px] truncate">
            {image.title.length > 50
              ? `${image.title.slice(0, 50)}...`
              : image.title}
          </div>
        );
      },
    },
    {
      accessorKey: "filename",
      header: "File Name",
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
            <span className="truncate">
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
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const image = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(image.filename)}
              >
                Copiar URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];
