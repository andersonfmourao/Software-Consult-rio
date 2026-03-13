import { UploadForm } from "@/components/upload-form";
import { prisma } from "@/lib/prisma";

export default async function DocumentosPage() {
  const [patients, docs] = await Promise.all([
    prisma.patient.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" }
    }),
    prisma.document.findMany({
      include: { patient: true },
      orderBy: { uploadedAt: "desc" },
      take: 20
    })
  ]);

  return (
    <div className="grid">
      <header className="page-header">
        <h1>Documentos</h1>
        <p>Envie e consulte PDFs, imagens e termos assinados.</p>
      </header>

      <section className="grid grid-2">
        <article className="card stack">
          <h2>Novo documento</h2>
          <UploadForm patients={patients} />
        </article>

        <article className="card stack">
          <h2>Documentos recentes</h2>
          {docs.map((doc) => (
            <p key={doc.id}>
              {doc.title} - {doc.patient.fullName} ({doc.type})
            </p>
          ))}
        </article>
      </section>
    </div>
  );
}
