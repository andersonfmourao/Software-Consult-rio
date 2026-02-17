"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { pacienteSchema } from "@/lib/validators";

export async function createPacienteAction(_: unknown, formData: FormData) {
  const session = requireSession();
  const parsed = pacienteSchema.safeParse({
    nomeCompleto: formData.get("nomeCompleto"),
    telefoneWhatsapp: formData.get("telefoneWhatsapp"),
    email: formData.get("email"),
    dataNascimento: formData.get("dataNascimento"),
    observacoes: formData.get("observacoes")
  });

  if (!parsed.success) return { error: "Dados do paciente inválidos." };

  const paciente = await prisma.paciente.create({
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
      dataNascimento: parsed.data.dataNascimento ? new Date(parsed.data.dataNascimento) : null
    }
  });

  await writeAuditLog({
    userId: session.userId,
    action: "CREATE",
    entityType: "Paciente",
    entityId: paciente.id,
    diff: parsed.data
  });

  revalidatePath("/pacientes");
  return { success: true };
}

export async function updatePacienteAction(id: string, _: unknown, formData: FormData) {
  const session = requireSession();
  const parsed = pacienteSchema.safeParse({
    nomeCompleto: formData.get("nomeCompleto"),
    telefoneWhatsapp: formData.get("telefoneWhatsapp"),
    email: formData.get("email"),
    dataNascimento: formData.get("dataNascimento"),
    observacoes: formData.get("observacoes")
  });

  if (!parsed.success) return { error: "Dados do paciente inválidos." };

  const paciente = await prisma.paciente.update({
    where: { id },
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
      dataNascimento: parsed.data.dataNascimento ? new Date(parsed.data.dataNascimento) : null
    }
  });

  await writeAuditLog({
    userId: session.userId,
    action: "UPDATE",
    entityType: "Paciente",
    entityId: paciente.id,
    diff: parsed.data
  });

  revalidatePath("/pacientes");
  revalidatePath(`/pacientes/${id}`);
  return { success: true };
}
