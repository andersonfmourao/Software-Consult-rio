import Link from "next/link";
import { createPacienteAction } from "@/actions/paciente-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

export default async function PacientesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}) {
  const { q = "", page = "1", sort = "updated" } = await searchParams;
  const currentPage = Number(page) || 1;

  const where = q
    ? {
        OR: [
          { nomeCompleto: { contains: q, mode: "insensitive" as const } },
          { telefoneWhatsapp: { contains: q, mode: "insensitive" as const } }
        ]
      }
    : {};

  const orderBy =
    sort === "lastAtendimento"
      ? [
          { atendimentos: { _count: "desc" as const } },
          { updatedAt: "desc" as const }
        ]
      : [{ updatedAt: "desc" as const }];

  const [total, pacientes] = await Promise.all([
    prisma.paciente.count({ where }),
    prisma.paciente.findMany({
      where,
      orderBy,
      include: {
        atendimentos: { orderBy: { dataHora: "desc" }, take: 1 }
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  ]);

  return (
    <section className="space-y-6">
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Novo paciente</h2>
        <form action={createPacienteAction} className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Nome completo</Label>
            <Input name="nomeCompleto" required />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input name="telefoneWhatsapp" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" />
          </div>
          <div>
            <Label>Data nascimento</Label>
            <Input name="dataNascimento" type="date" />
          </div>
          <div className="md:col-span-2">
            <Label>Observações</Label>
            <Input name="observacoes" />
          </div>
          <Button type="submit" className="md:col-span-2">
            Salvar paciente
          </Button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          <form className="flex flex-1 gap-2">
            <Input name="q" defaultValue={q} placeholder="Buscar por nome ou telefone" />
            <select name="sort" defaultValue={sort} className="rounded-md border px-3 text-sm">
              <option value="updated">Atualização recente</option>
              <option value="lastAtendimento">Último atendimento</option>
            </select>
            <Button type="submit">Buscar</Button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-2">Paciente</th>
                <th>WhatsApp</th>
                <th>Último atendimento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2">{p.nomeCompleto}</td>
                  <td>{p.telefoneWhatsapp}</td>
                  <td>{p.atendimentos[0]?.dataHora ? new Date(p.atendimentos[0].dataHora).toLocaleString("pt-BR") : "—"}</td>
                  <td>
                    <Link className="text-sm underline" href={`/pacientes/${p.id}`}>
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Total: {total}</span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link className="underline" href={`/pacientes?page=${currentPage - 1}&q=${q}&sort=${sort}`}>
                Anterior
              </Link>
            )}
            {currentPage * PAGE_SIZE < total && (
              <Link className="underline" href={`/pacientes?page=${currentPage + 1}&q=${q}&sort=${sort}`}>
                Próxima
              </Link>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
