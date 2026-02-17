import { describe, expect, it } from "vitest";
import { loginSchema, pacienteSchema } from "@/lib/validators";

describe("schemas", () => {
  it("valida login corretamente", () => {
    expect(loginSchema.safeParse({ email: "x@x.com", password: "123456" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "x", password: "123" }).success).toBe(false);
  });

  it("exige campos obrigatórios de paciente", () => {
    expect(
      pacienteSchema.safeParse({ nomeCompleto: "Ana Silva", telefoneWhatsapp: "11999999999" }).success
    ).toBe(true);
    expect(pacienteSchema.safeParse({ nomeCompleto: "A", telefoneWhatsapp: "11" }).success).toBe(false);
  });
});
