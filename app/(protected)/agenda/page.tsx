import { prisma } from "@/lib/prisma";
import { format, startOfWeek, endOfWeek } from "date-fns";

export default async function AgendaPage({ searchParams }: { searchParams: { view?: string } }) {
  const view = searchParams.view === "day" ? "day" : "week";
  const now = new Date();
  const rangeStart = view === "day" ? new Date(now.setHours(0, 0, 0, 0)) : startOfWeek(new Date(), { weekStartsOn: 1 });
  const rangeEnd = view === "day" ? new Date(now.setHours(23, 59, 59, 999)) : endOfWeek(new Date(), { weekStartsOn: 1 });

  const appointments = await prisma.appointment.findMany({
    where: { startsAt: { gte: rangeStart, lte: rangeEnd } },
    include: { patient: true, dentist: true },
    orderBy: { startsAt: "asc" }
  });

  return (
    <div className="grid">
      <header className="page-header">
        <h1>Agenda</h1>
        <p>Visualize os atendimentos da {view === "day" ? "data atual" : "semana corrente"}.</p>
      </header>

      <section className="card">
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <a className="pill" href="/agenda?view=day">Visão diária</a>
          <a className="pill" href="/agenda?view=week">Visão semanal</a>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Paciente</th>
              <th>Dentista</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{format(a.startsAt, "dd/MM/yyyy HH:mm")}</td>
                <td>{a.patient.fullName}</td>
                <td>{a.dentist.name}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
