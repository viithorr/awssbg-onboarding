"use client";

import { useState } from "react";
import { CalendarDays, Info, Mail, Menu } from "lucide-react";
import { BrandMark } from "./brand-mark";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="header-inner page-width">
        <BrandMark />
        <nav className={open ? "open" : ""} aria-label="Navegação principal">
          <a onClick={() => setOpen(false)} className="active" href="#agendamento"><CalendarDays /> Onboardings</a>
          <a onClick={() => setOpen(false)} href="#sobre"><Info /> Sobre o grupo</a>
          <a onClick={() => setOpen(false)} href="#contato"><Mail /> Contato</a>
        </nav>
        <button className="menu-button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} type="button"><Menu /></button>
      </div>
    </header>
  );
}
