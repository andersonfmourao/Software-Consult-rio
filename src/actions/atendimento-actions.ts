"use server";

import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";
import { requireSession } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { uploadToCloud } from "@/lib/upload";
import { atendimentoSchema } from "@/lib/validators";

export async function createAtendimentoAction(_: unknown, formData: FormData) {
  const session = requireSession();
  const parsed = atendimentoSchema.safeParse({
    pacienteId: formData.get("pacienteId"),
    dataHora: formData.get("dataHora"),
    categoria: formData.get("categoria"),
    descricao: formData.get("descricao"),
    valor: formData.get("valor")
  });

  if (!parsed.success) return { error: "Dados do atendimento inválidos." };

  const files = formData.getAll("anexos").filter((f): f is File => f instanceof File && f.size > 0);

  const atendimento = await prisma.atendimento.create({
    data: {
      pacienteId: parsed.data.pacienteId,
      dataHora: new Date(parsed.data.dataHora),
      categoria: parsed.data.categoria,
      descricao: parsed.data.descricao,
      valor: parsed.data.valor ? new Decimal(parsed.data.valor) : null
    }
  });

  for (const file of files) {
    const meta = await uploadToCloud(file);
    await prisma.anexo.create({
      data: {
        atendimentoId: atendimento.id,
        ...meta
      }
    });
  }

  await writeAuditLog({
    userId: session.userId,
    action: "CREATE",
    entityType: "Atendimento",
    entityId: atendimento.id,
    diff: parsed.data
  });

  revalidatePath(`/pacientes/${parsed.data.pacienteId}`);
  revalidatePath("/pacientes");
  return { success: true };
}
