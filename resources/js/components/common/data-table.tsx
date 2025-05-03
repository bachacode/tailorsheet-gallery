import * as React from "react";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import DataTablePagination from "./data-table-pagination";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterFields?: string[]; // Array of column IDs to search
  filterPlaceholder?: string;
  visibleColumns?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterFields = ["id"], // Default to searching by "id"
  filterPlaceholder = "Buscar...",
  visibleColumns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  // Filter columns based on visibleColumns prop
  const filteredColumns = React.useMemo(() => {
    if (!visibleColumns) return columns; // Show all columns if visibleColumns is not defined
    return columns.filter((column) => visibleColumns.includes(column.id as string));
  }, [columns, visibleColumns]);

  // Filter data based on globalFilter and filterFields
  const filteredData = React.useMemo(() => {
    if (!globalFilter) return data;

    return data.filter((row) =>
      filterFields.some((field) => {
        const value = row[field as keyof TData];

        // Handle arrays (e.g., tags)
        if (Array.isArray(value)) {
          return value.some((item) =>
            item.name?.toString().toLowerCase().includes(globalFilter.toLowerCase())
          );
        }

        // Handle strings and other types
        return value?.toString().toLowerCase().includes(globalFilter.toLowerCase());
      })
    );
  }, [data, globalFilter, filterFields]);

  const table = useReactTable({
    data: filteredData, // Use filtered data
    columns: filteredColumns, // Use filtered columns
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Filter search input */}
      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={filterPlaceholder}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)} // Update global filter
          className="pl-10 max-w-full"
        />
      </div>

      <DataTablePagination table={table} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
