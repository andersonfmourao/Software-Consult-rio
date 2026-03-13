"use client";

import { useState } from "react";

type PatientOption = { id: string; fullName: string };

export function UploadForm({ patients }: { patients: PatientOption[] }) {
  const [message, setMessage] = useState("");
  const singlePatient = patients.length === 1;

  return (
    <form
      className="stack"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const res = await fetch("/api/upload", { method: "POST", body: data });
        setMessage(res.ok ? "Upload realizado com sucesso." : "Falha no upload.");
        if (res.ok) form.reset();
      }}
    >
      <input name="title" placeholder="Título do documento" />

      {singlePatient ? (
        <>
          <input value={patients[0].fullName} disabled />
          <input name="patientId" value={patients[0].id} type="hidden" readOnly />
        </>
      ) : (
        <select name="patientId" required>
          <option value="">Selecione o paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </select>
      )}

      <input name="file" type="file" accept="application/pdf,image/*" required />
      <button type="submit">Enviar documento</button>
      <small>{message}</small>
    </form>
  );
}
