"use client";

import { ControllerRenderProps, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema } from "../schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { NumericFormat, PatternFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useEffect, useState, useTransition } from "react";
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
import StatesCombobox from "./states-combobox";
import CitiesCombobox from "./cities-combobox";

type LeadFormData = z.infer<typeof leadSchema>;

const supplyTypes = [
  {
    label: "Monofásico",
    value: "monofasico",
  },
  {
    label: "Bifásico",
    value: "bifasico",
  },
  {
    label: "Trifásico",
    value: "trifasico",
  },
];

const HomeForm = () => {
  const [progress, setProgress] = useState(35);
  const [states, setStates] = useState<States[]>([]);
  const [cities, setCities] = useState<Cities[]>([]);
  const [open, setOpen] = useState(false);

  const [pendingStates, startStatesTransition] = useTransition();
  const [pendingCities, startCitiesTransition] = useTransition();

  useEffect(() => {
    const fetchStates = () => {
      startStatesTransition(async () => {
        try {
          const response = await axios.get("/api/states");
          setStates(response.data);
        } catch (error) {
          console.error("Failed to fetch states:", error);
        }
      });
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      city: "",
      cpf: "",
      email: "",
      energyBill: undefined,
      name: "",
      phone: "",
      state: "",
      supplyType: "",
    },
  });

  const stateUfChanges = form.watch("state");

  useEffect(() => {
    const handleUfSelectChange = async () => {
      startCitiesTransition(async () => {
        const stateUf = form.getValues("state");
        if (stateUf) {
          try {
            const response = await axios.get(`/api/states/${stateUf}/cities`);
            setCities(response.data);
            form.setValue("city", "");
          } catch (error) {
            console.error("Failed to fetch cities:", error);
          }
        }
      });
    };

    handleUfSelectChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateUfChanges]);

  const steps = [1, 2, 3];

  const step = Math.floor(progress / 25);

  const handleSubmit = async (values: LeadFormData) => {
    return;
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      alert("Lead capturado com sucesso!");
    } else {
      alert("Erro ao capturar lead");
    }
  };

  const countProgress = (type: "previous" | "next") => {
    if (progress >= 100 && type === "next") return;

    if (type === "previous") {
      if (step === 4) {
        return setProgress((step - 2) * 25);
      }

      return setProgress((step - 1) * 25);
    }

    if (step === 2) {
      return setProgress(100);
    }

    return setProgress((step + 1) * 25);
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-start pt-32 gap-8">
      <h3 className="text-3xl">
        Calcule a sua conta e veja seus possíveis gastos futuros!
      </h3>

      <div className="flex flex-col items-center h-full w-[400px]">
        <div className="flex relative w-full my-8">
          <Progress value={progress} className="h-2" />
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "absolute rounded-full w-7 h-7  flex items-center justify-center -top-[10px]",
                step * 23 < progress
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground border"
              )}
              style={{
                left: `${step * 23}%`,
              }}
            >
              {step}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 w-full flex flex-col"
          >
            {step < 2 && (
              <>
                <FormField
                  control={form.control}
                  name="energyBill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Valor mensal da conta de energia em R$
                      </FormLabel>
                      <FormControl>
                        <NumericFormat
                          {...field}
                          onChange={() => {}}
                          onValueChange={({ floatValue }) => {
                            field.onChange(floatValue);
                          }}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          fixedDecimalScale
                          decimalScale={2}
                          displayType="input"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  disabled={states.length <= 0 || pendingStates}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <StatesCombobox
                          field={field as unknown as ControllerRenderProps}
                          form={form as unknown as UseFormReturn}
                          states={states}
                          disabled={states.length <= 0 || pendingStates}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  disabled={
                    form.getValues("state")?.length <= 0 || pendingCities
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <CitiesCombobox
                          field={field as unknown as ControllerRenderProps}
                          form={form as unknown as UseFormReturn}
                          cities={cities}
                          disabled={
                            form.getValues("state")?.length <= 0 ||
                            pendingCities
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Fornecimento</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                supplyTypes.find(
                                  (type) => type.value === field.value
                                )?.label || "Selecione um Tipo de Fornecimento"
                              }
                            ></SelectValue>

                            <SelectContent>
                              {supplyTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectTrigger>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  disabled={states.length <= 0 || pendingStates}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <PatternFormat
                          {...field}
                          format="+55 (##) # ####-####"
                          displayType="input"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <PatternFormat
                          {...field}
                          format="###.###.###-##"
                          displayType="input"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex gap-2 self-end">
              {step > 1 && (
                <Button
                  type="button"
                  className="self-end"
                  variant={"outline"}
                  onClick={() => countProgress("previous")}
                >
                  Voltar
                </Button>
              )}

              {step < 2 ? (
                <Button
                  type="button"
                  className="self-end"
                  onClick={() => countProgress("next")}
                >
                  Avançar
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="self-end"
                  onClick={() => countProgress("next")}
                >
                  Enviar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HomeForm;
