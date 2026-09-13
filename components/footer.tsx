import { BrandMark } from "./brand-mark";

export function Footer({ scheduling = false }: { scheduling?: boolean }) {
  const privacyHref = scheduling ? "/agendamento/privacidade" : "/privacidade";
  const termsHref = scheduling ? "/agendamento/termos" : "/termos";
  return (
    <footer className="footer">
      <div className="page-width footer-inner">
        <BrandMark compact />
        <p>Aprender. Construir. Conectar. <a href={privacyHref}>Privacidade</a> <a href={termsHref}>Termos</a></p>
        <img className="footer-pixel" src="/logosbg.svg" alt="AWS Student Builder Group UVV" />
      </div>
    </footer>
  );
}
