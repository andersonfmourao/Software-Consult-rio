import Link from "next/link";
import { Users, LayoutDashboard } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-white p-6 lg:block">
      <h2 className="mb-6 text-xl font-semibold">Clínica Cloud</h2>
      <nav className="space-y-2 text-sm">
        <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100" href="/dashboard">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
        <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100" href="/pacientes">
          <Users className="h-4 w-4" /> Pacientes
        </Link>
      </nav>
    </aside>
  );
}
