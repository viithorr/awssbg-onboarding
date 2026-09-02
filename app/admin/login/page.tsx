import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { login } from "./actions";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="admin-login"><div className="admin-login-card"><BrandMark /><span className="admin-lock"><LockKeyhole /></span><h1>Acesso administrativo</h1><p>Área exclusiva da equipe organizadora do processo seletivo.</p>{error && <div className="admin-error" role="alert">{error === "unauthorized" ? "Esta conta não possui acesso administrativo." : "E-mail ou senha incorretos."}</div>}<form action={login}><label htmlFor="admin-email">E-mail</label><input id="admin-email" name="email" type="email" autoComplete="username" required /><label htmlFor="admin-password">Senha</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required /><button type="submit">Entrar no painel</button></form><Link href="/">← Voltar ao agendamento</Link></div></main>;
}
