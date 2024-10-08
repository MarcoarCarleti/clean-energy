import { checkIfIsValidBrazilianPhoneNumber } from "@/lib/utils";
import { cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório!"),
  email: z.string().email("Email inválido!"),
  phone: z
    .string()
    .min(20, "Telefone inválido!")
    .refine(checkIfIsValidBrazilianPhoneNumber, {
      message: "Telefone inválido!",
    }),
  cpf: z
    .string()
    .min(14, "CPF inválido!")
    .max(14, "CPF inválido!")
    .refine(cpf.isValid, {
      message: "Por favor digite um CPF válido",
    }),
  city: z
    .string({ required_error: "Cidade é obrigatória!" })
    .min(2, "Cidade é obrigatória!"),
  state: z.string().min(2, "Estado é obrigatório!").max(2, "Estado inválido!"),
  energyBill: z
    .number({
      required_error: "Valor da conta é obrigatório!",
    })
    .positive("Valor da conta deve ser positivo!")
    .min(1, "Valor da conta é obrigatório!"),
  supplyType: z.string().min(2, "Tipo de fornecimento é obrigatório!"),
});
