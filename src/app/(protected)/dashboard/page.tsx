import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [pacientes, atendimentos] = await Promise.all([
    prisma.paciente.count(),
    prisma.atendimento.count()
  ]);

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="text-sm text-muted-foreground">Pacientes cadastrados</h2>
        <p className="text-3xl font-semibold">{pacientes}</p>
      </Card>
      <Card>
        <h2 className="text-sm text-muted-foreground">Atendimentos registrados</h2>
        <p className="text-3xl font-semibold">{atendimentos}</p>
      </Card>
    </section>
  );
}
