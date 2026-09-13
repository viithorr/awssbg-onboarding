import Link from "next/link";

export const metadata = { title: "Termos de Uso | AWS SBG UVV" };

export default function TermsPage() {
  return <main className="legal-page"><div className="legal-window"><p className="eyebrow"><span>▣</span> AWS SBG UVV</p><h1>Termos de Uso</h1><p className="legal-updated">Última atualização: 13 de setembro de 2026</p>
    <section><h2>1. Finalidade do site</h2><p>Este site apresenta o AWS Student Builder Group na Universidade Vila Velha, seus canais, atividades e formas de participação na comunidade.</p></section>
    <section><h2>2. Uso adequado</h2><p>O conteúdo deve ser utilizado de forma lícita e respeitosa. Não é permitido tentar comprometer a segurança, a disponibilidade ou o funcionamento do site.</p></section>
    <section><h2>3. Conteúdo e atualizações</h2><p>Buscamos manter as informações corretas e atualizadas, mas datas, atividades, integrantes e canais podem mudar. Comunicados publicados nos canais oficiais complementam as informações deste site.</p></section>
    <section><h2>4. Serviços externos</h2><p>Instagram, Meetup e WhatsApp são serviços independentes. O acesso a esses canais está sujeito aos termos e às políticas das respectivas plataformas.</p></section>
    <section><h2>5. Disponibilidade</h2><p>O site pode passar por manutenção, atualização ou indisponibilidade temporária. A equipe poderá modificar seus conteúdos e funcionalidades quando necessário.</p></section>
    <section><h2>6. Contato</h2><p>Dúvidas podem ser enviadas para <a href="mailto:awssbg.uvv@gmail.com">awssbg.uvv@gmail.com</a>.</p></section>
    <Link className="legal-back" href="/">← Voltar para a Home</Link>
  </div></main>;
}
