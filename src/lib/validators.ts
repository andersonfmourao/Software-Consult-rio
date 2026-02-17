import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const pacienteSchema = z.object({
  nomeCompleto: z.string().min(2),
  telefoneWhatsapp: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  dataNascimento: z.string().optional(),
  observacoes: z.string().optional()
});

export const atendimentoSchema = z.object({
  pacienteId: z.string().min(1),
  dataHora: z.string().min(1).refine((value) => !Number.isNaN(Date.parse(value)), "Data/hora inválida"),
  categoria: z.enum(["AVALIACAO", "LIMPEZA", "IMPLANTE", "PROTESE", "OUTROS"]),
  descricao: z.string().min(3),
  valor: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Number(v)), "Valor inválido")
});
