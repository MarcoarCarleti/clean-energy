"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "./ui/button";
import { FileSpreadsheetIcon, PlusIcon } from "lucide-react";
import { DataTable } from "./ui/data-table";
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import LoadingSpinner from "./loading-spinner";

interface EntityTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  pageCount: number;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  tableName: string;
  isLoading: boolean;
  isAbleToExport: boolean;
}

export function EntityTable<TData, TValue>({
  columns,
  data,
  title = "",
  pageCount,
  pagination,
  setPagination,
  tableName,
  isLoading = false,
  isAbleToExport,
}: EntityTableProps<TData, TValue>) {
  const { toast } = useToast();

  const [pending, setIsPending] = useState(false);

  const exportDataToExcel = async () => {
    setIsPending(true);

    try {
      const response = await axios.get("/api/leads/export", {
        responseType: "blob",
      });

      if (typeof window !== "undefined") {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "leads.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao exportar a tabela, por favor, tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="md:container py-10">
      <div className="flex flex-col md:flex-row  justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold">{title}</h1>

        {isAbleToExport && (
          <Button onClick={exportDataToExcel} className="hover:cursor-pointer">
            {pending ? <LoadingSpinner /> : <FileSpreadsheetIcon />}
          </Button>
        )}
      </div>
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
