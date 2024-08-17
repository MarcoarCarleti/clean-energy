"use client";

import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Button } from "./button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LoadingSpinner from "../loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  tableName: string;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  setPagination,
  tableName,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount,
    state: {
      pagination,
      sorting,
    },
  });

  const totalPages = table.getPageCount();

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          {columns.map((column, index) => (
            <TableCell key={index} className="py-4">
              <Skeleton className="w-full h-5" />
            </TableCell>
          ))}
        </TableRow>
      );
    }

    if (table.getRowModel().rows?.length) {
      return table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? "selected" : undefined}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={`${
                cell.column.columnDef.id === "actions"
                  ? "sticky right-0 bg-transparent"
                  : ""
              }`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          <div className="w-full flex items-center justify-center">
            {`Nenhum(a) ${tableName} encontrado(a).`}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderPagination = () => {
    const { pageIndex } = pagination;

    const generatePageNumbers = () => {
      const pageNumbers = [];

      if (totalPages > 5) {
        const lastPage = totalPages - 1;
        const isLastPage = pageIndex === totalPages - 1;
        pageNumbers.push(0);

        if (isLastPage) {
          pageNumbers.push("...");
          pageNumbers.push(lastPage - 1);
        } else if (pageIndex > 0 && pageIndex < lastPage) {
          if (pageIndex === lastPage - 1) pageNumbers.push("...");
          pageNumbers.push(pageIndex);
        } else if (totalPages > 1) {
          pageNumbers.push(1);
        }

        if (pageIndex < totalPages - 2) {
          pageNumbers.push("...");
        }

        if (totalPages > 1) {
          pageNumbers.push(totalPages - 1);
        }

        return pageNumbers;
      }

      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    return totalPages > 0 ? (
      <div className="flex justify-center items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            return page === "..." ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant={pagination.pageIndex === page ? "default" : "outline"}
                onClick={() => table.setPageIndex(page as number)}
              >
                {(page as number) + 1}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    ) : (
      <></>
    );
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>
      <div className="flex justify-center items-center gap-2 py-4">
        {renderPagination()}
      </div>
    </div>
  );
}
