"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarCheck, Check, Clock3, LockKeyhole, Mail, Search, Settings, UserRound } from "lucide-react";

type Candidate = { id: string; name: string };
type Slot = { id: string; startsAt: string; endsAt: string };

export function OnboardingFlow({ candidates }: { candidates: Candidate[] }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [success, setBookingSuccess] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const filteredCandidates = useMemo(() => candidates.filter(({ name }) => name.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR"))), [candidates, query]);

  async function verifyEmail(event: FormEvent) {
    event.preventDefault();
    if (!candidate || !email) return;
    setVerifying(true);
    setVerificationError("");
    try {
      const response = await fetch("/api/candidates/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ candidateId: candidate.id, email }) });
      const result = await response.json();
      if (!response.ok || !result.valid) throw new Error(result.message ?? "Não foi possível validar seus dados.");
      const slotsResponse = await fetch("/api/slots", { headers: { authorization: `Bearer ${result.token}` } });
      const slotsResult = await slotsResponse.json();
      if (!slotsResponse.ok) throw new Error(slotsResult.message ?? "Não foi possível carregar os horários.");
      setSlots(slotsResult.slots);
      setVerificationToken(result.token);
      setVerified(true);
    } catch (error) {
      setVerified(false);
      setVerificationError(error instanceof Error ? error.message : "Não foi possível validar seus dados.");
    } finally {
      setVerifying(false);
    }
  }

  async function confirmBooking() {
    if (!slot || !verificationToken || booking) return;
    setBooking(true);
    setBookingError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${verificationToken}` },
        body: JSON.stringify({ slotId: slot.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Não foi possível confirmar o agendamento.");
      setBookingSuccess(true);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Não foi possível confirmar o agendamento.");
      window.alert(error instanceof Error ? error.message : "Não foi possível confirmar o agendamento.");
    } finally {
      setBooking(false);
    }
  }

  function setSuccess(_: boolean) {
    void confirmBooking();
  }

  return (
    <section id="agendamento" className="booking-layout">
      <div className="timeline">
        <Step number="1" icon={<UserRound />} title="Selecione seu nome" state={candidate ? "done" : "active"}>
          <div className="candidate-box">
            <label className="sr-only" htmlFor="candidate-search">Busque e selecione seu nome</label>
            <div className="search-field"><Search aria-hidden="true" /><input id="candidate-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={candidate?.name || "Escolha seu nome"} autoComplete="off" /></div>
            {query && !candidate && <ul className="candidate-options">{filteredCandidates.map((item) => <li key={item.id}><button type="button" onClick={() => { setCandidate(item); setQuery(""); }}>{item.name}</button></li>)}</ul>}
            {!query && !candidate && <button className="select-trigger" type="button" onClick={() => setQuery(" ")}>Ver candidatos</button>}
            {candidate && <button className="change-candidate" type="button" onClick={() => { setCandidate(null); setVerified(false); setSlot(null); setSlots([]); setEmail(""); setVerificationError(""); }}>Alterar nome</button>}
          </div>
        </Step>

        <Step number="2" icon={<Mail />} title="Confirme seu e-mail" state={verified ? "done" : candidate ? "active" : "locked"}>
          <form onSubmit={verifyEmail} className="email-form">
            <label className="sr-only" htmlFor="email">Digite seu e-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setVerified(false); setSlot(null); setVerificationError(""); }} placeholder="Digite seu e-mail" disabled={!candidate} required />
            <button type="submit" disabled={!candidate || !email || verifying}>{verifying ? "Confirmando..." : verified ? "E-mail confirmado" : "Confirmar e-mail"}</button>
          </form>
          {verificationError && <p className="field-error" role="alert">{verificationError}</p>}
          <p className="field-help">Usaremos este e-mail para validar sua inscrição e enviar os dados da reserva.</p>
        </Step>

        <Step number="3" icon={<Clock3 />} title="Escolha um horário disponível" state={verified ? "active" : "locked"} last>
          {!verified ? <div className="locked-message"><LockKeyhole /> Horários serão exibidos após confirmar seu e-mail</div> : slots.length ? <div className="slots"><p>Horários disponíveis</p><div>{slots.map((item) => { const date = new Date(item.startsAt); const label = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(date); return <button className={slot?.id === item.id ? "selected" : ""} onClick={() => setSlot(item)} type="button" key={item.id}>{slot?.id === item.id && <Check />} {label}</button>; })}</div></div> : <div className="locked-message">Nenhum horário disponível no momento.</div>}
        </Step>
      </div>

      <aside className="summary-card" aria-live="polite">
        <div className="pixel-decoration" aria-hidden="true" />
        <p className="summary-label"><CalendarCheck /> Sua reserva</p>
        {success ? <div className="summary-main success"><span className="calendar-icon"><Check /></span><h2>Onboarding agendado!</h2><p>Sua reserva foi confirmada com sucesso.</p></div> : <div className="summary-main"><span className="calendar-icon"><Check /></span><h2>{slot ? candidate?.name : "Nenhum horário selecionado"}</h2><p>{slot ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(slot.startsAt)) : "Complete os passos ao lado para visualizar e confirmar sua reserva."}</p></div>}
        <div className="summary-details">
          <SummaryItem icon={<Clock3 />} title="Onboarding individual" text="Duração média: 25 minutos" />
          <SummaryItem icon={<Mail />} title="Formato online" text="Link será enviado por e-mail" />
          <SummaryItem icon={<Settings />} title="Pontualidade" text="Chegue 5 minutos antes do seu horário" />
        </div>
        {slot && !success && <button className="confirm-booking" onClick={() => setSuccess(true)} type="button">Confirmar agendamento</button>}
      </aside>
    </section>
  );
}

function Step({ number, icon, title, state, last = false, children }: { number: string; icon: React.ReactNode; title: string; state: "active" | "done" | "locked"; last?: boolean; children: React.ReactNode }) {
  return <section className={`step step-${state} ${last ? "step-last" : ""}`}><div className="step-rail"><span className="step-icon">{icon}</span></div><div className="step-content"><h2><span>{state === "done" ? <Check /> : number}</span>{title}</h2>{children}</div></section>;
}

function SummaryItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="summary-item"><span>{icon}</span><p><strong>{title}</strong><small>{text}</small></p></div>;
}
