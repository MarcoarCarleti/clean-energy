"use client";

import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import LoadingSpinner from "./loading-spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import axios from "axios";

interface DeleteButtonProps {
  name: string;
  id: number;
  label: string;
}

const DeleteButton = ({ id, name, label }: DeleteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteButtonClick = () => {
    setIsLoading(true);

    axios
      .delete(`/api/leads`, {
        headers: { "Content-Type": "application/json" },
        data: {
          leadId: id,
        },
      })
      .then(() => {
        typeof window !== "undefined" && location.reload();
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Erro",
          description:
            "Ocorreu um erro ao excluir, por favor, tente novamente.",
        });
      });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Dialog>
            <DialogTrigger asChild>
              <Trash2Icon color="red" fill="black" />
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir {label}</DialogTitle>
                <DialogDescription>Esta ação é irreversível</DialogDescription>
              </DialogHeader>

              <span>
                Você deseja excluir a {label} de{" "}
                <span className="font-semibold">{name}</span>?
              </span>

              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button disabled={isLoading} variant={"destructive"}>
                    Cancelar
                  </Button>
                </DialogClose>

                <Button disabled={isLoading} onClick={handleDeleteButtonClick}>
                  {isLoading ? <LoadingSpinner /> : "Excluir"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>Excluir {label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DeleteButton;
