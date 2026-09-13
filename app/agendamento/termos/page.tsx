import Link from "next/link";

export const metadata = { title: "Termos do Agendamento | AWS SBG UVV" };

export default function SchedulingTermsPage() {
  return <main className="legal-page"><div className="legal-window"><p className="eyebrow"><span>▣</span> Processo seletivo</p><h1>Termos do Agendamento</h1><p className="legal-updated">Última atualização: 13 de setembro de 2026</p>
    <section><h2>1. Finalidade</h2><p>Esta área é destinada ao agendamento e acompanhamento do onboarding do processo seletivo do AWS Student Builder Group da Universidade Vila Velha.</p></section>
    <section><h2>2. Uso da plataforma</h2><p>O candidato deve selecionar apenas o próprio nome, informar o e-mail utilizado na inscrição e reservar um único horário disponível. Informações incorretas ou uso indevido podem levar ao cancelamento da reserva.</p></section>
    <section><h2>3. Agendamento</h2><p>A confirmação gera um evento no Google Agenda e um link do Google Meet. Para alterar ou cancelar uma reserva, o candidato deve entrar em contato com a equipe.</p></section>
    <section><h2>4. Participação</h2><p>O candidato é responsável por verificar o convite recebido, acessar o encontro no horário e avisar a equipe caso não possa comparecer.</p></section>
    <section><h2>5. Disponibilidade</h2><p>A equipe busca manter o sistema disponível e correto, mas poderá realizar manutenções ou ajustes. Eventuais problemas serão tratados pelos canais oficiais.</p></section>
    <section><h2>6. Contato</h2><p>Dúvidas podem ser enviadas para <a href="mailto:awssbg.uvv@gmail.com">awssbg.uvv@gmail.com</a>.</p></section>
    <Link className="legal-back" href="/agendamento">← Voltar para o agendamento</Link>
  </div></main>;
}
