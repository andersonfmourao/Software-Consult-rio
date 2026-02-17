import { logoutAction } from "@/actions/auth-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/auth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = requireSession();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="mb-6 flex items-center justify-between rounded-lg border bg-white p-4">
          <div>
            <p className="font-medium">{session.email}</p>
            <p className="text-xs text-muted-foreground">Perfil: {session.role}</p>
          </div>
          <form action={logoutAction}>
            <Button variant="outline" type="submit">
              Sair
            </Button>
          </form>
        </header>
        {children}
      </main>
    </div>
  );
}
