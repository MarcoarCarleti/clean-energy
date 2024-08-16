import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório!"),
  email: z.string().email("Email inválido!"),
  phone: z.string().min(10, "Telefone inválido!"),
  cpf: z.string().min(11, "CPF inválido!").max(11, "CPF inválido!"),
  city: z.string().min(2, "Cidade é obrigatória!"),
  state: z.string().min(2, "Estado é obrigatório!").max(2, "Estado inválido!"),
  energyBill: z.number().positive("Valor da conta deve ser positivo!"),
  supplyType: z.string().min(2, "Tipo de fornecimento é obrigatório!"),
});
