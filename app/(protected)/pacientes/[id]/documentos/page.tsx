import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UploadForm } from "@/components/upload-form";

export default async function PacienteDocumentosPage({ params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      documents: { orderBy: { uploadedAt: "desc" } }
    }
  });

  if (!patient) notFound();

  return (
    <div className="grid grid-2">
      <section className="card stack">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Documentos do paciente</h1>
          <p>{patient.fullName}</p>
        </div>

        <UploadForm patients={[{ id: patient.id, fullName: patient.fullName }]} />
        <Link href={`/pacientes/${patient.id}`} className="pill">Voltar para ficha</Link>
      </section>

      <section className="card stack">
        <h2>Arquivos enviados</h2>
        {patient.documents.length === 0 ? <p>Nenhum documento anexado.</p> : null}
        {patient.documents.map((doc) => (
          <a key={doc.id} href={doc.fileUrl} target="_blank">
            {doc.title} ({doc.type})
          </a>
        ))}
      </section>
    </div>
  );
}
