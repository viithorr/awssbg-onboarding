import { CalendarDays, Info, Mail, Menu } from "lucide-react";
import { BrandMark } from "./brand-mark";

export function Header() {
  return (
    <header className="header">
      <div className="header-inner page-width">
        <BrandMark />
        <nav aria-label="Navegação principal">
          <a className="active" href="#agendamento"><CalendarDays /> Onboardings</a>
          <a href="#sobre"><Info /> Sobre o grupo</a>
          <a href="#contato"><Mail /> Contato</a>
        </nav>
        <button className="menu-button" aria-label="Abrir menu" type="button"><Menu /></button>
      </div>
    </header>
  );
}
