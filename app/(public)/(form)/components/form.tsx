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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useEffect, useMemo, useState, useTransition } from "react";
import { cn, formatCurrency, SUPPLY_TYPES } from "@/lib/utils";
import axios from "axios";
import StatesCombobox from "./states-combobox";
import CitiesCombobox from "./cities-combobox";
import { useToast } from "@/components/ui/use-toast";

type LeadFormData = z.infer<typeof leadSchema>;

const HomeForm = () => {
  const [progress, setProgress] = useState(35);
  const [states, setStates] = useState<States[]>([]);
  const [cities, setCities] = useState<Cities[]>([]);

  const [pendingStates, startStatesTransition] = useTransition();
  const [pendingCities, startCitiesTransition] = useTransition();

  const { toast } = useToast();

  const steps = [1, 2, 3];

  const step = Math.floor(progress / 25);


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

  const calculateSavings = (energyBill: number) => {
    const discount = 0.25;
    const monthlySavings = energyBill - energyBill * discount;

    const savings = {
      withDiscount: {
        oneYear: monthlySavings * 12,
        threeYears: monthlySavings * 12 * 3,
        fiveYears: monthlySavings * 12 * 5,
      },
      withoutDiscount: {
        oneYear: energyBill * 12,
        threeYears: energyBill * 12 * 3,
        fiveYears: energyBill * 12 * 5,
      },
    };

    return savings;
  };

  const energyBill = form.watch("energyBill");
  const savings = useMemo(
    () => calculateSavings(energyBill || 0),
    [energyBill]
  );


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

  const handleSubmit = async (values: LeadFormData) => {
    try {
      const response = await axios.post("/api/leads", values);

      if (response.status === 200) {
        countProgress("next");
        toast({
          title: "Sucesso",
          description: "Formulário enviado com sucesso!",
        });

        return;
      }
    } catch (err: any) {
      if (err.response.data.error === "Please wait to submit this form again.") {
        toast({
          title: "Erro",
          description: err.response.data.time,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Erro",
        description: "Erro ao enviar o formulário, tente novamente mais tarde.",
        variant: "destructive",
      });
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
      <h3 className="text-2xl text-center">
        Faça uma simulação e veja seus possíveis gastos futuros!
      </h3>

      <div className="flex flex-col items-center h-full max-w-[400px] w-full px-8">
        <div className="flex relative w-full px-8 my-8">
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
            className="space-y-8 w-full flex flex-col pb-12"
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
                          allowNegative={false}
                          placeholder="R$ 0,00"
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
                                SUPPLY_TYPES.find(
                                  (type) => type.value === field.value
                                )?.label || "Selecione um Tipo de Fornecimento"
                              }
                            ></SelectValue>

                            <SelectContent>
                              {SUPPLY_TYPES.map((type) => (
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
                          allowEmptyFormatting
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
                          allowEmptyFormatting
                          mask="_"
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

            {step === 4 && (
              <div className="flex flex-col gap-4">
                <div className="space-y-4">
                  <h4 className="text-2xl font-semibold">
                    Valor sem o Clean Energy
                  </h4>
                  <div>
                    <p>
                      <strong>Valor em 1 ano: </strong>
                      {formatCurrency(savings.withoutDiscount.oneYear)}
                    </p>
                    <p>
                      <strong>Valor em 3 anos: </strong>
                      {formatCurrency(savings.withoutDiscount.threeYears)}
                    </p>
                    <p>
                      <strong>Valor em 5 anos: </strong>
                      {formatCurrency(savings.withoutDiscount.fiveYears)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-semibold">
                    Valor com o Clean Energy
                  </h4>
                  <div>
                    <p>
                      <strong>Economia em 1 ano: </strong>
                      {formatCurrency(savings.withDiscount.oneYear)}
                    </p>
                    <p>
                      <strong>Economia em 3 anos: </strong>
                      {formatCurrency(savings.withDiscount.threeYears)}
                    </p>
                    <p>
                      <strong>Economia em 5 anos: </strong>
                      {formatCurrency(savings.withDiscount.fiveYears)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 self-end">
              {step > 1 && (
                <Button
                  type="button"
                  className="self-end"
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    countProgress("previous");
                  }}
                >
                  Voltar
                </Button>
              )}

              {step < 2 ? (
                <Button
                  type="button"
                  className="self-end"
                  onClick={(e) => {
                    e.preventDefault();
                    countProgress("next");
                  }}
                >
                  Avançar
                </Button>
              ) : (
                step < 4 && (
                  <Button type="submit" className="self-end">
                    Enviar
                  </Button>
                )
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HomeForm;
