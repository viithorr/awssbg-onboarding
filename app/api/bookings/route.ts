import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCalendarBooking, deleteCalendarBooking } from "@/lib/google-calendar";
import { createAdminClient } from "@/lib/supabase/admin";
import { readVerificationToken } from "@/lib/verification-token";

const schema = z.object({ slotId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const verified = readVerificationToken(token);
  if (!verified) return NextResponse.json({ message: "Validação expirada. Confirme seu e-mail novamente." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Horário inválido." }, { status: 400 });

  const supabase = createAdminClient();
  const [{ data: candidate }, { data: slot }] = await Promise.all([
    supabase.from("candidates").select("id,name,email,active").eq("id", verified.candidateId).maybeSingle(),
    supabase.from("slots").select("id,starts_at,ends_at,blocked").eq("id", parsed.data.slotId).maybeSingle(),
  ]);
  if (!candidate?.active) return NextResponse.json({ message: "Candidato não encontrado." }, { status: 404 });
  if (!slot || slot.blocked || new Date(slot.starts_at) <= new Date()) return NextResponse.json({ message: "Este horário não está mais disponível." }, { status: 409 });

  const accessToken = randomBytes(32).toString("base64url");
  const { data: booking, error: insertError } = await supabase.from("bookings").insert({
    candidate_id: candidate.id,
    slot_id: slot.id,
    status: "pending",
    access_token_hash: createHash("sha256").update(accessToken).digest("hex"),
  }).select("id").single();
  if (insertError) {
    const conflict = insertError.code === "23505";
    return NextResponse.json({ message: conflict ? "Este candidato ou horário já possui uma reserva." : "Não foi possível registrar a reserva." }, { status: conflict ? 409 : 500 });
  }

  let eventId: string | undefined;
  try {
    const calendar = await createCalendarBooking({ bookingId: booking.id, candidateName: candidate.name, candidateEmail: candidate.email, startsAt: slot.starts_at, endsAt: slot.ends_at });
    eventId = calendar.eventId;
    const { error } = await supabase.from("bookings").update({ status: "confirmed", google_event_id: calendar.eventId, meet_url: calendar.meetUrl, updated_at: new Date().toISOString() }).eq("id", booking.id);
    if (error) throw error;
    return NextResponse.json({ bookingId: booking.id, accessToken, meetUrl: calendar.meetUrl });
  } catch (error) {
    if (eventId) await deleteCalendarBooking(eventId).catch(() => undefined);
    await supabase.from("bookings").update({ status: "calendar_failed", updated_at: new Date().toISOString() }).eq("id", booking.id);
    console.error("Falha ao criar reserva no Google Agenda", error);
    return NextResponse.json({ message: "A reserva foi registrada, mas o convite não pôde ser criado. Fale com a equipe." }, { status: 502 });
  }
}
