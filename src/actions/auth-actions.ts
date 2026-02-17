"use server";

import { redirect } from "next/navigation";
import { loginWithPassword, logout } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: "Credenciais inválidas." };
  }

  const user = await loginWithPassword(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Email ou senha incorretos." };

  redirect("/dashboard");
}

export async function logoutAction() {
  logout();
  redirect("/login");
}
