import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function DashboardPage() {
  const [appointments, patients, tasks] = await Promise.all([
    prisma.appointment.findMany({
      where: { startsAt: { gte: new Date() } },
      take: 6,
      orderBy: { startsAt: "asc" },
      include: { patient: true }
    }),
    prisma.patient.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.task.findMany({ where: { status: "PENDENTE" }, take: 6, orderBy: { dueDate: "asc" } })
  ]);

  return (
    <div className="grid">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Resumo operacional com atendimentos, pacientes recentes e tarefas pendentes.</p>
      </header>

      <section className="grid grid-3">
        <article className="card stack">
          <h2>Próximos atendimentos</h2>
          {appointments.length === 0 ? <p>Sem atendimentos agendados.</p> : null}
          {appointments.map((item) => (
            <p key={item.id}>
              {item.patient.fullName} · {format(item.startsAt, "dd/MM HH:mm")}
            </p>
          ))}
        </article>

        <article className="card stack">
          <h2>Pacientes recentes</h2>
          {patients.map((item) => (
            <p key={item.id}>{item.fullName}</p>
          ))}
        </article>

        <article className="card stack">
          <h2>Tarefas</h2>
          {tasks.length === 0 ? <p>Nenhuma tarefa pendente.</p> : null}
          {tasks.map((item) => (
            <p key={item.id}>{item.title}</p>
          ))}
        </article>
      </section>
    </div>
  );
}
