import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PacientesPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const pacientes = await prisma.patient.findMany({
    where: q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { cpf: { contains: q } }
          ]
        }
      : undefined,
    orderBy: { fullName: "asc" }
  });

  return (
    <div className="grid">
      <header className="page-header">
        <h1>Lista de pacientes</h1>
        <p>Busca rápida por nome, CPF ou telefone.</p>
      </header>

      <section className="card">
        <form style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input name="q" placeholder="Buscar por nome, telefone ou CPF" defaultValue={q} />
          <button type="submit">Buscar</button>
        </form>

        <p style={{ marginBottom: 12 }}>
          <Link href="/pacientes/novo" className="pill">+ Novo paciente</Link>
        </p>

        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.fullName}</td>
                <td>{p.cpf}</td>
                <td>{p.phone}</td>
                <td>
                  <Link href={`/pacientes/${p.id}`} className="pill">Ficha</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
