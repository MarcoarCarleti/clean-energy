import { ControllerRenderProps, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema } from "../schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

interface StatesComboxProps {
  cities: Cities[];
  field: ControllerRenderProps;
  form: UseFormReturn;
  disabled?: boolean
}

const CitiesCombobox = ({ field, cities, form, disabled }: StatesComboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {field.value
            ?  cities.find((city) => city.nome === field.value)?.nome
            : "Selecione uma Cidade"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Pesquisar"></CommandInput>

          <CommandList>
            <CommandEmpty>Nenhum(a) cidade encontrado.</CommandEmpty>

            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.nome}
                  onSelect={(value) => {
                    const currentValue = value === field.value ? "" : value;

                    form.setValue("city", currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field.value === city.nome ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitiesCombobox;
