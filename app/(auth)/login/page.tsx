import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <section className="card" style={{ maxWidth: 420, width: "100%" }}>
        <div className="page-header" style={{ marginBottom: 22 }}>
          <h1>Acessar sistema</h1>
          <p>Entre com seu e-mail e senha para acessar o OdontoGestão.</p>
        </div>

        <form
          className="stack"
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/dashboard"
            });
          }}
        >
          <input name="email" type="email" placeholder="E-mail" required />
          <input name="password" type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>

        <p style={{ marginTop: 14, color: "#64748b", fontSize: 13 }}>
          Seed: admin@consultorio.com / 123456
        </p>
      </section>
    </main>
  );
}
