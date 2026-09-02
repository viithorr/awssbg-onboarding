import { CalendarDays, CheckCircle2, Clock3, LogOut, Plus, Trash2, UserX, Users, XCircle } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { cancelBooking, createSlots, deleteSlot, logout, toggleSlot, updateBookingStatus } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "Aguardando confirmação", confirmed: "Confirmado", calendar_failed: "Falha no convite",
  cancelled: "Cancelado", completed: "Concluído", no_show: "Não compareceu",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireAdmin();
  const { error } = await searchParams;
  const supabase = createAdminClient();
  const [{ data: slots }, { data: bookings }, { count: candidateCount }] = await Promise.all([
    supabase.from("slots").select("id,starts_at,ends_at,blocked,bookings(id,status)").order("starts_at"),
    supabase.from("bookings").select("id,status,meet_url,candidates(name),slots(starts_at)").order("created_at", { ascending: false }).limit(30),
    supabase.from("candidates").select("id", { head: true, count: "exact" }).eq("active", true),
  ]);
  const activeBookings = (bookings ?? []).filter((item) => item.status !== "cancelled");

  return <main className="admin-shell">
    <header className="admin-header"><div><span className="uvv-badge">sbgUVV</span><strong>Painel do onboarding</strong></div><form action={logout}><button type="submit"><LogOut /> Sair</button></form></header>
    <div className="admin-content">
      <div className="admin-heading"><div><p>CORE TEAM 2026/2027</p><h1>Central de controle</h1><span>{user.email}</span></div></div>
      {error && <div className="admin-error">{errorMessage(error)}</div>}
      <section className="admin-stats"><Stat icon={<Users />} value={candidateCount ?? 0} label="Candidatos" /><Stat icon={<CalendarDays />} value={activeBookings.length} label="Agendados" /><Stat icon={<Clock3 />} value={(slots ?? []).filter((item) => !item.blocked).length} label="Horários cadastrados" /></section>
      <section className="admin-grid">
        <div className="admin-panel">
          <div className="admin-panel-title"><div><Plus /><h2>Adicionar horários</h2></div><p>Gere vários slots de uma só vez.</p></div>
          <form action={createSlots} className="slot-form"><label>Data<input type="date" name="date" required /></label><label>Início<input type="time" name="start" required /></label><label>Fim<input type="time" name="end" required /></label><label>Intervalo<select name="interval" defaultValue="25"><option value="25">25 minutos</option><option value="30">30 minutos</option><option value="60">60 minutos</option></select></label><button type="submit">Criar horários</button></form>
        </div>
        <div className="admin-panel">
          <div className="admin-panel-title"><div><Clock3 /><h2>Próximos horários</h2></div><p>Bloqueie, libere ou exclua a disponibilidade.</p></div>
          <div className="slot-list">{(slots ?? []).length ? slots!.map((slot) => {
            const hasHistory = slot.bookings.length > 0;
            const booked = slot.bookings.some((booking) => !["cancelled", "completed", "no_show"].includes(booking.status));
            return <div className="slot-row" key={slot.id}><div><strong>{formatDate(slot.starts_at, "medium")}</strong><span>{booked ? "Reservado" : slot.blocked ? "Bloqueado" : "Disponível"}</span></div><div className="slot-actions"><form action={toggleSlot}><input type="hidden" name="id" value={slot.id} /><input type="hidden" name="blocked" value={String(slot.blocked)} /><button disabled={booked} type="submit">{slot.blocked ? "Liberar" : "Bloquear"}</button></form><form action={deleteSlot}><input type="hidden" name="id" value={slot.id} /><button className="danger-button" disabled={hasHistory} title={hasHistory ? "Horários com histórico não podem ser excluídos" : "Excluir horário"} type="submit"><Trash2 /><span className="sr-only">Excluir horário</span></button></form></div></div>;
          }) : <p className="admin-empty">Nenhum horário cadastrado.</p>}</div>
        </div>
      </section>
      <section className="admin-panel bookings-panel">
        <div className="admin-panel-title"><div><CalendarDays /><h2>Reservas recentes</h2></div></div>
        <div className="admin-table-wrap"><table><thead><tr><th>Candidato</th><th>Data e hora</th><th>Status</th><th>Meet</th><th>Ações</th></tr></thead><tbody>{(bookings ?? []).map((booking) => {
          const candidate = firstRelation<{ name: string }>(booking.candidates);
          const bookingSlot = firstRelation<{ starts_at: string }>(booking.slots);
          return <tr key={booking.id}><td>{candidate?.name ?? "Candidato não encontrado"}</td><td>{bookingSlot?.starts_at ? formatDate(bookingSlot.starts_at, "short") : "—"}</td><td><span className={`status-badge status-${booking.status}`}>{statusLabels[booking.status] ?? booking.status}</span></td><td>{booking.meet_url ? <a href={booking.meet_url} target="_blank" rel="noreferrer">Abrir Meet</a> : "—"}</td><td><BookingActions id={booking.id} status={booking.status} /></td></tr>;
        })}</tbody></table>{!bookings?.length && <p className="admin-empty">Nenhuma reserva realizada.</p>}</div>
      </section>
    </div>
  </main>;
}

function BookingActions({ id, status }: { id: string; status: string }) {
  if (status === "cancelled") return <span className="action-muted">Sem ações</span>;
  return <div className="booking-actions">
    {status === "confirmed" && <><form action={updateBookingStatus}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value="completed" /><button title="Marcar como concluído"><CheckCircle2 /><span>Concluir</span></button></form><form action={updateBookingStatus}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value="no_show" /><button title="Marcar ausência"><UserX /><span>Ausente</span></button></form></>}
    {!["completed", "no_show"].includes(status) && <form action={cancelBooking}><input type="hidden" name="id" value={id} /><button className="danger-button" title="Cancelar reserva e convite"><XCircle /><span>Cancelar</span></button></form>}
  </div>;
}

function errorMessage(error: string) {
  if (error === "calendar-cancel") return "Não foi possível cancelar o convite no Google Agenda.";
  if (error === "slot-has-history") return "Esse horário possui histórico e não pode ser excluído. Você pode bloqueá-lo.";
  return "Não foi possível concluir a operação. Confira os dados.";
}

function formatDate(value: string, dateStyle: "short" | "medium") { return new Intl.DateTimeFormat("pt-BR", { dateStyle, timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(value)); }
function firstRelation<T>(value: T | T[] | null): T | null { return Array.isArray(value) ? value[0] ?? null : value; }
function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) { return <div className="admin-stat"><span>{icon}</span><div><strong>{value}</strong><p>{label}</p></div></div>; }
