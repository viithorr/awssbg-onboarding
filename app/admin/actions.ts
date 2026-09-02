"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createUserClient } from "@/lib/supabase/server";
import { deleteCalendarBooking } from "@/lib/google-calendar";

const slotSchema = z.object({ date: z.string().date(), start: z.string().regex(/^\d{2}:\d{2}$/), end: z.string().regex(/^\d{2}:\d{2}$/), interval: z.coerce.number().int().min(15).max(120) });

export async function createSlots(formData: FormData) {
  await requireAdmin();
  const parsed = slotSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin?error=invalid-slot");
  const { date, start, end, interval } = parsed.data;
  const startAt = new Date(`${date}T${start}:00-03:00`);
  const endAt = new Date(`${date}T${end}:00-03:00`);
  if (endAt <= startAt) redirect("/admin?error=invalid-slot");
  const slots = [];
  for (let cursor = startAt.getTime(); cursor + interval * 60000 <= endAt.getTime(); cursor += interval * 60000) slots.push({ starts_at: new Date(cursor).toISOString(), ends_at: new Date(cursor + interval * 60000).toISOString() });
  const { error } = await createAdminClient().from("slots").upsert(slots, { onConflict: "starts_at", ignoreDuplicates: true });
  if (error) redirect("/admin?error=database");
  revalidatePath("/admin"); revalidatePath("/");
}

export async function toggleSlot(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const blocked = String(formData.get("blocked")) === "true";
  if (!z.string().uuid().safeParse(id).success) return;
  await createAdminClient().from("slots").update({ blocked: !blocked }).eq("id", id);
  revalidatePath("/admin"); revalidatePath("/");
}

export async function deleteSlot(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = createAdminClient();
  const { count } = await supabase.from("bookings").select("id", { head: true, count: "exact" }).eq("slot_id", id);
  if (count) redirect("/admin?error=slot-has-history");
  const { error } = await supabase.from("slots").delete().eq("id", id);
  if (error) redirect("/admin?error=database");
  revalidatePath("/admin"); revalidatePath("/");
}

export async function cancelBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = createAdminClient();
  const { data: booking } = await supabase.from("bookings").select("id,status,google_event_id").eq("id", id).maybeSingle();
  if (!booking || booking.status === "cancelled") return;
  if (booking.google_event_id) {
    try { await deleteCalendarBooking(booking.google_event_id); }
    catch { redirect("/admin?error=calendar-cancel"); }
  }
  const { error } = await supabase.from("bookings").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", id);
  if (error) redirect("/admin?error=database");
  revalidatePath("/admin"); revalidatePath("/");
}

export async function updateBookingStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!z.string().uuid().safeParse(id).success || !["completed", "no_show"].includes(status)) return;
  await createAdminClient().from("bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("status", "confirmed");
  revalidatePath("/admin");
}

export async function logout() {
  const client = await createUserClient();
  await client.auth.signOut();
  redirect("/admin/login");
}
