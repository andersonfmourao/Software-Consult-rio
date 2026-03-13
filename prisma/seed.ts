import { DocumentType, PrismaClient, Role, TreatmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@consultorio.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@consultorio.com",
      role: Role.ADMIN,
      passwordHash
    }
  });

  const dentist = await prisma.user.upsert({
    where: { email: "dentista@consultorio.com" },
    update: {},
    create: {
      name: "Dra. Ana",
      email: "dentista@consultorio.com",
      role: Role.DENTISTA,
      passwordHash
    }
  });

  const secretary = await prisma.user.upsert({
    where: { email: "secretaria@consultorio.com" },
    update: {},
    create: {
      name: "Secretária Julia",
      email: "secretaria@consultorio.com",
      role: Role.SECRETARIA,
      passwordHash
    }
  });

  const patient = await prisma.patient.upsert({
    where: { cpf: "12345678901" },
    update: {},
    create: {
      fullName: "Carlos Souza",
      cpf: "12345678901",
      phone: "11999998888",
      birthDate: new Date("1991-04-15"),
      address: "Rua Central, 100 - São Paulo",
      notes: "Alergia leve a dipirona"
    }
  });

  const prontuario = await prisma.prontuario.upsert({
    where: { patientId: patient.id },
    update: {},
    create: {
      patientId: patient.id,
      createdById: dentist.id,
      anamnese: "Paciente sem comorbidades relevantes.",
      alergias: "Dipirona",
      medicamentosUso: "Nenhum",
      observacoes: "Primeiro atendimento no consultório."
    }
  });

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      dentistId: dentist.id,
      createdById: secretary.id,
      prontuarioId: prontuario.id,
      startsAt: new Date(Date.now() + 86400000),
      endsAt: new Date(Date.now() + 90000000),
      notes: "Avaliação inicial"
    }
  });

  await prisma.tratamento.create({
    data: {
      patientId: patient.id,
      prontuarioId: prontuario.id,
      dentistId: dentist.id,
      nome: "Profilaxia e raspagem",
      descricao: "Plano inicial de limpeza e prevenção.",
      status: TreatmentStatus.EM_ANDAMENTO,
      dataInicio: new Date()
    }
  });

  await prisma.document.create({
    data: {
      patientId: patient.id,
      prontuarioId: prontuario.id,
      uploadedById: secretary.id,
      title: "Termo de consentimento",
      type: DocumentType.TERMO,
      fileUrl: "/uploads/termo-consentimento.pdf"
    }
  });

  await prisma.task.create({
    data: {
      title: "Confirmar consulta de amanhã",
      dueDate: new Date(Date.now() + 3600000),
      assignedToId: admin.id
    }
  });
}

main().finally(async () => prisma.$disconnect());
