import { createPatient } from "@/lib/actions";

export default function NovoPacientePage() {
  return (
    <div className="card">
      <h1>Novo paciente</h1>
      <form action={createPatient} className="grid grid-2">
        <input name="fullName" placeholder="Nome completo" required />
        <input name="cpf" placeholder="CPF" required />
        <input name="phone" placeholder="Telefone" required />
        <input name="birthDate" type="date" required />
        <input name="address" placeholder="Endereço" required />
        <textarea name="notes" placeholder="Observações" style={{ gridColumn: "1 / -1" }} />
        <button type="submit" style={{ gridColumn: "1 / -1" }}>Salvar</button>
      </form>
    </div>
  );
}
