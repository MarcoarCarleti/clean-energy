"use client";

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import LoadingSpinner from "./loading-spinner";
import { FileSpreadsheetIcon } from "lucide-react";

const ExportDataButton = ({ ...props }: ButtonProps) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const exportDataToExcel = async () => {
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              onClick={exportDataToExcel}
              className="hover:cursor-pointer"
            >
              {isLoading ? <LoadingSpinner /> : <FileSpreadsheetIcon />}
            </Button>
          </div>
        </TooltipTrigger>

        <TooltipContent side="right" className="ml-2">
          {isLoading ? "Carregando" : "Exportar para Excel"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExportDataButton;
