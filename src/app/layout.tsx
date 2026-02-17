import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clínica Odontológica",
  description: "Sistema interno de controle de pacientes"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
