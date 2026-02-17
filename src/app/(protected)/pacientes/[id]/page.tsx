import { notFound } from "next/navigation";
import { createAtendimentoAction } from "@/actions/atendimento-actions";
import { updatePacienteAction } from "@/actions/paciente-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";

export default async function PacienteDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await prisma.paciente.findUnique({
    where: { id },
    include: {
      atendimentos: {
        orderBy: { dataHora: "desc" },
        include: { anexos: true }
      }
    }
  });

  if (!paciente) notFound();

  const updateAction = updatePacienteAction.bind(null, id);

  return (
    <section className="space-y-6">
      <Card className="space-y-3">
        <h1 className="text-xl font-semibold">Paciente</h1>
        <form action={updateAction} className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Nome completo</Label>
            <Input name="nomeCompleto" defaultValue={paciente.nomeCompleto} required />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input name="telefoneWhatsapp" defaultValue={paciente.telefoneWhatsapp} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" defaultValue={paciente.email ?? ""} />
          </div>
          <div>
            <Label>Data de nascimento</Label>
            <Input
              type="date"
              name="dataNascimento"
              defaultValue={paciente.dataNascimento ? new Date(paciente.dataNascimento).toISOString().slice(0, 10) : ""}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Observações</Label>
            <Input name="observacoes" defaultValue={paciente.observacoes ?? ""} />
          </div>
          <Button type="submit" className="md:col-span-2">
            Atualizar paciente
          </Button>
        </form>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Novo atendimento</h2>
        <form action={createAtendimentoAction} className="grid gap-3 md:grid-cols-2" encType="multipart/form-data">
          <input type="hidden" name="pacienteId" value={paciente.id} />
          <div>
            <Label>Data e hora</Label>
            <Input name="dataHora" type="datetime-local" required />
          </div>
          <div>
            <Label>Categoria</Label>
            <select name="categoria" className="h-10 w-full rounded-md border bg-white px-3" defaultValue="AVALIACAO">
              <option value="AVALIACAO">Avaliação</option>
              <option value="LIMPEZA">Limpeza</option>
              <option value="IMPLANTE">Implante</option>
              <option value="PROTESE">Prótese</option>
              <option value="OUTROS">Outros</option>
            </select>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input name="descricao" required />
          </div>
          <div>
            <Label>Valor</Label>
            <Input name="valor" placeholder="0.00" />
          </div>
          <div className="md:col-span-2">
            <Label>Anexos</Label>
            <Input name="anexos" type="file" multiple />
          </div>
          <Button type="submit" className="md:col-span-2">
            Registrar atendimento
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-xl font-semibold">Timeline</h2>
        <ul className="space-y-4">
          {paciente.atendimentos.map((a) => (
            <li key={a.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{a.categoria}</p>
                <span className="text-sm text-muted-foreground">{new Date(a.dataHora).toLocaleString("pt-BR")}</span>
              </div>
              <p className="mt-1 text-sm">{a.descricao}</p>
              {a.valor && <p className="text-sm">R$ {a.valor.toString()}</p>}
              {a.anexos.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-sm">
                  {a.anexos.map((anexo) => (
                    <li key={anexo.id}>
                      <a className="underline" href={anexo.url} target="_blank">
                        {anexo.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
