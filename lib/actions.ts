"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function createPatient(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.patient.create({
    data: {
      fullName: formData.get("fullName") as string,
      cpf: formData.get("cpf") as string,
      phone: formData.get("phone") as string,
      birthDate: new Date(formData.get("birthDate") as string),
      address: formData.get("address") as string,
      notes: (formData.get("notes") as string) || null
    }
  });

  revalidatePath("/pacientes");
  redirect("/pacientes");
}

export async function createAppointment(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.appointment.create({
    data: {
      patientId: formData.get("patientId") as string,
      dentistId: formData.get("dentistId") as string,
      startsAt: new Date(formData.get("startsAt") as string),
      endsAt: new Date(formData.get("endsAt") as string),
      notes: (formData.get("notes") as string) || null
    }
  });

  revalidatePath("/agenda");
}
