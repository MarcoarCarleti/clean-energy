import { ColumnDef, PaginationState } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "./ui/data-table";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface EntityTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  registerPath: string;
  pageCount: number;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  tableName: string;
  isLoading: boolean;
  isChildren?: boolean;
  buttonTitle?: string;
}

export function EntityTable<TData, TValue>({
  columns,
  data,
  title = "",
  registerPath,
  pageCount,
  pagination,
  setPagination,
  tableName,
  isLoading = false,
  isChildren = false,
  buttonTitle = "Nova consulta",
}: EntityTableProps<TData, TValue>) {
  return (
    <div
      className={cn("md:container py-10", !isChildren && "lg:!pl-24 lg:!pr-2")}
    >
      {!isChildren && (
        <div className="flex flex-col md:flex-row  justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <Link href={registerPath}>
            <Button className="flex gap-1 text-base">
              <PlusIcon size={24} />
              {buttonTitle}
            </Button>
          </Link>
        </div>
      )}
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        tableName={tableName}
        isLoading={isLoading}
      />
    </div>
  );
}