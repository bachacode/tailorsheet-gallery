"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import DataTablePagination from "./data-table-pagination"
import { Search } from "lucide-react"

interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  contentColumns: string[] // Column IDs to render in card content
  footerColumns?: string[] // Column IDs to render in card footer
  filterField?: string
  filterPlaceholder?: string
  itemsPerRow?: number
}

export function DataGrid<TData, TValue>({
  columns,
  data,
  contentColumns,
  footerColumns = [],
  filterField = "id",
  filterPlaceholder = "Buscar...",
  itemsPerRow = 5,
}: DataGridProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
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
  })

  // Set default page size
  React.useEffect(() => {
    table.setPageSize(10)
  }, [table])

  // Calculate grid template columns based on itemsPerRow
  const gridTemplateColumns = `repeat(${itemsPerRow}, minmax(0, 1fr))`

  return (
    <div className="w-full space-y-4">
      {/* Filter search input */}
      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(filterField)?.setFilterValue(event.target.value)}
          className="pl-10 max-w-full"
        />
      </div>

      <DataTablePagination table={table} />

      {table.getRowModel().rows?.length ? (
        <div className="grid" style={{ gridTemplateColumns }}>
          {table.getRowModel().rows.map((row) => {
            // Get content cells based on contentColumns prop
            const contentCells = row.getAllCells().filter((cell) => contentColumns.includes(cell.column.id))

            // Get footer cells based on footerColumns prop
            const footerCells =
              footerColumns.length > 0 ? row.getAllCells().filter((cell) => footerColumns.includes(cell.column.id)) : []

            return (
              <Card
                key={row.id}
                className="m-2 py-0 gap-0 overflow-hidden border rounded-md hover:shadow-md transition-shadow"
                data-state={row.getIsSelected() && "selected"}
              >
                <CardContent className="px-0 flex flex-col items-center justify-center">
                  {contentCells.map((cell) => (
                    <div key={cell.id} className="flex flex-col items-center justify-center w-full">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </CardContent>
                {footerCells.length > 0 && (
                  <CardFooter className="p-2 flex justify-end gap-2 border-t bg-muted/20">
                    {footerCells.map((cell) => (
                      <div key={cell.id} className="flex items-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </CardFooter>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="h-24 text-center flex items-center justify-center">Sin resultados.</div>
      )}

      <DataTablePagination table={table} />
    </div>
  )
}
