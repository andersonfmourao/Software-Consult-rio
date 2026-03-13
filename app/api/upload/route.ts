import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentType } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const allowedMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp"
];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const patientId = formData.get("patientId") as string;
  const title = formData.get("title") as string;

  if (!file || !patientId) {
    return Response.json({ error: "Dados inválidos" }, { status: 400 });
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return Response.json({ error: "Tipo de arquivo não permitido" }, { status: 415 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return Response.json({ error: "Arquivo acima do limite de 8MB" }, { status: 413 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { prontuario: { select: { id: true } } }
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = path.join(process.cwd(), "public", "uploads");
  await mkdir(folder, { recursive: true });

  const normalizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const safeName = `${Date.now()}-${normalizedName}`;
  const filePath = path.join(folder, safeName);
  await writeFile(filePath, buffer);

  const type = file.type.includes("pdf")
    ? DocumentType.PDF
    : file.type.includes("image")
      ? DocumentType.IMAGEM
      : DocumentType.TERMO;

  await prisma.document.create({
    data: {
      patientId,
      prontuarioId: patient?.prontuario?.id ?? null,
      uploadedById: session.user.id,
      title: title || file.name,
      type,
      fileUrl: `/uploads/${safeName}`
    }
  });

  return Response.json({ success: true });
}
