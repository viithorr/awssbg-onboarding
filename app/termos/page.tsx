import Link from "next/link";

export const metadata = { title: "Termos de Uso | AWS SBG UVV" };

export default function TermsPage() {
  return <main className="legal-page"><div className="legal-window"><p className="eyebrow"><span>▣</span> AWS SBG UVV</p><h1>Termos de Uso</h1><p className="legal-updated">Última atualização: 1º de setembro de 2026</p>
    <section><h2>1. Finalidade</h2><p>Esta aplicação é destinada ao agendamento e acompanhamento do onboarding do processo seletivo do AWS Student Builder Group da Universidade Vila Velha.</p></section>
    <section><h2>2. Uso da plataforma</h2><p>O candidato deve selecionar apenas o próprio nome, informar o e-mail utilizado na inscrição e reservar um único horário disponível. Informações incorretas ou uso indevido podem levar ao cancelamento da reserva.</p></section>
    <section><h2>3. Agendamento</h2><p>A confirmação gera um evento no Google Agenda e um link do Google Meet. Em caso de necessidade de alteração ou cancelamento, o candidato deve entrar em contato com a equipe.</p></section>
    <section><h2>4. Disponibilidade</h2><p>A equipe busca manter a aplicação disponível e correta, mas poderá realizar manutenções ou ajustes. Eventuais problemas serão tratados pelos canais oficiais de contato.</p></section>
    <section><h2>5. Contato</h2><p>Dúvidas podem ser enviadas para <a href="mailto:awssbg.uvv@gmail.com">awssbg.uvv@gmail.com</a>.</p></section>
    <Link className="legal-back" href="/">← Voltar para o agendamento</Link>
  </div></main>;
}
