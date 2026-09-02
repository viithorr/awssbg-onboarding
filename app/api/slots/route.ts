import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readVerificationToken } from "@/lib/verification-token";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!readVerificationToken(token)) return NextResponse.json({ message: "Validação expirada." }, { status: 401 });
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("slots").select("id,starts_at,ends_at,bookings!left(id,status)").eq("blocked", false).gt("starts_at", new Date().toISOString()).order("starts_at");
  if (error) return NextResponse.json({ message: "Não foi possível carregar os horários." }, { status: 500 });
  const slots = (data ?? []).filter((slot) => !slot.bookings?.some((booking) => booking.status !== "cancelled")).map(({ id, starts_at, ends_at }) => ({ id, startsAt: starts_at, endsAt: ends_at }));
  return NextResponse.json({ slots });
}
