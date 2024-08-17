"use client";

import { EntityTable } from "@/components/entity-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Lead } from "@prisma/client";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { paginate } from "@/lib/utils";

const AdminPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { toast } = useToast();

  useEffect(() => {
    const getLeads = async () => {
      setIsLoading(true);
      const response = await axios.get("/api/leads");

      if (response.status === 200) {
        setData(paginate(response.data, pagination.pageSize));
        setTotalPages(Math.ceil(response.data.length / pagination.pageSize));
        setIsLoading(false);
        return;
      }

      toast({
        title: "Erro",
        description:
          "Erro ao capturar as respostas, por favor, tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    getLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(data);

  return (
    <div className="w-full bg-background p-5 text-3xl flex flex-col">
      <div className="text-md">
        <EntityTable
          columns={columns}
          isLoading={isLoading}
          data={(data[pagination.pageIndex] as unknown as Lead[]) || []}
          pageCount={totalPages}
          pagination={pagination}
          setPagination={setPagination}
          tableName="resposta"
          title="Respostas"
        />
      </div>
    </div>
  );
};

export default AdminPage;
