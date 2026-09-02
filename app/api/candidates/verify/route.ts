import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createVerificationToken } from "@/lib/verification-token";

const schema = z.object({ candidateId: z.string().uuid(), email: z.string().trim().email().max(254) });
const attempts = new Map<string, { count: number; resetAt: number }>();

function blocked(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 10;
}

function sameEmail(left: string, right: string) {
  const a = Buffer.from(left.trim().toLocaleLowerCase("pt-BR"));
  const b = Buffer.from(right.trim().toLocaleLowerCase("pt-BR"));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (blocked(ip)) return NextResponse.json({ valid: false, message: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ valid: false, message: "Confira os dados e tente novamente." }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("candidates").select("id,email").eq("id", parsed.data.candidateId).eq("active", true).maybeSingle();
  if (error) return NextResponse.json({ valid: false, message: "Não foi possível validar agora. Tente novamente." }, { status: 503 });
  if (!data || !sameEmail(data.email, parsed.data.email)) {
    return NextResponse.json({ valid: false, message: "Não encontramos esse e-mail associado ao nome selecionado. Confira os dados e tente novamente." }, { status: 401 });
  }
  return NextResponse.json({ valid: true, token: createVerificationToken(data.id) });
}
