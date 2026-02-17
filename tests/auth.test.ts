import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth-utils";

describe("auth password", () => {
  it("deve gerar hash válido", async () => {
    const hash = await hashPassword("senha123");
    expect(hash).not.toBe("senha123");
    await expect(verifyPassword("senha123", hash)).resolves.toBe(true);
  });
});
