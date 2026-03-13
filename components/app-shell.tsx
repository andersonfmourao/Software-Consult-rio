import Link from "next/link";
import { LayoutDashboard, CalendarDays, Users, FileText, UserRound } from "lucide-react";
import { LogoutButton } from "./logout-button";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/documentos", label: "Documentos", icon: FileText }
];

export function AppShell({ children, role }: { children: React.ReactNode; role: string }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div>
          <h1 className="brand">OdontoGestão</h1>
          <p className="brand-subtitle">MVP Consultório</p>
        </div>

        <nav className="sidebar-nav">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="sidebar-link">
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-badge">
            <UserRound size={16} />
            <span>{role}</span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="content-area">{children}</main>
    </div>
  );
}
