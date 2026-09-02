import { ExternalLink, Mail, MessageCircle } from "lucide-react";

const whatsappUrl = "https://wa.me/5513982283829?text=Ol%C3%A1!!%20Vim%20pelo%20site%20e%20quero%20saber%20mais%20sobre%20o%20SBG%20UVV";

export function ContactSection() {
  return <section className="contact-section" id="contato" aria-labelledby="contact-title">
    <div className="contact-section-copy"><p className="eyebrow"><span aria-hidden="true">▣</span> Contato</p><h2 id="contact-title">Fale com a <span>gente</span></h2><p>Tem alguma dúvida sobre o processo seletivo ou sobre o grupo? Escolha o canal que preferir.</p></div>
    <div className="contact-channel-grid">
      <a href="mailto:awssbg.uvv@gmail.com"><span><Mail /></span><div><small>E-MAIL</small><strong>awssbg.uvv@gmail.com</strong></div><ExternalLink /></a>
      <a href={whatsappUrl} target="_blank" rel="noreferrer"><span><MessageCircle /></span><div><small>WHATSAPP</small><strong>Conversar com o SBG UVV</strong></div><ExternalLink /></a>
    </div>
  </section>;
}
