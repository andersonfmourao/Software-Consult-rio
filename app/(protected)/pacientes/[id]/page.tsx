import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function PacienteDetalhe({ params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      appointments: { orderBy: { startsAt: "desc" } },
      procedures: { orderBy: { performedAt: "desc" } },
      treatmentPlans: { orderBy: { createdAt: "desc" } },
      clinicalEvolutions: { orderBy: { evolvedAt: "desc" } },
      documents: { orderBy: { uploadedAt: "desc" } }
    }
  });

  if (!patient) notFound();

  return (
    <div className="grid">
      <header className="page-header">
        <h1>Ficha do paciente</h1>
        <p>Dados clínicos e administrativos centralizados.</p>
      </header>

      <section className="card stack">
        <h2>{patient.fullName}</h2>
        <p>CPF: {patient.cpf}</p>
        <p>Telefone: {patient.phone}</p>
        <p>Endereço: {patient.address}</p>
        <p>Nascimento: {format(patient.birthDate, "dd/MM/yyyy")}</p>
        <p>Observações: {patient.notes ?? "-"}</p>
        <Link href={`/pacientes/${patient.id}/documentos`} className="pill">Ver documentos do paciente</Link>
      </section>

      <section className="grid grid-2">
        <article className="card stack">
          <h3>Consultas anteriores</h3>
          {patient.appointments.map((a) => (
            <p key={a.id}>{format(a.startsAt, "dd/MM/yyyy HH:mm")} - {a.status}</p>
          ))}
        </article>

        <article className="card stack">
          <h3>Procedimentos realizados</h3>
          {patient.procedures.map((p) => (
            <p key={p.id}>{p.title}</p>
          ))}
        </article>

        <article className="card stack">
          <h3>Plano de tratamento</h3>
          {patient.treatmentPlans.map((t) => (
            <p key={t.id}>{t.description} ({t.status})</p>
          ))}
        </article>

        <article className="card stack">
          <h3>Evolução clínica</h3>
          {patient.clinicalEvolutions.map((e) => (
            <p key={e.id}>{e.notes}</p>
          ))}
        </article>
      </section>
    </div>
  );
}
