import { BrandMark } from "./brand-mark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="page-width footer-inner">
        <BrandMark compact />
        <p>Aprender. Construir. Conectar. <a href="/privacidade">Privacidade</a> <a href="/termos">Termos</a></p>
        <img className="footer-pixel" src="/logosbg.svg" alt="AWS Student Builder Group UVV" />
      </div>
    </footer>
  );
}
