import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onboarding Individual | sbgUVV",
  description: "Agendamento do onboarding do Processo Seletivo Core Team 2026/2027.",
  icons: {
    icon: [{ url: "/faviconsbg.svg", type: "image/svg+xml" }],
    shortcut: "/faviconsbg.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
