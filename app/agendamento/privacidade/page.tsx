import Link from "next/link";

export const metadata = { title: "Privacidade do Agendamento | AWS SBG UVV" };

export default function SchedulingPrivacyPage() {
  return <main className="legal-page"><div className="legal-window"><p className="eyebrow"><span>▣</span> Processo seletivo</p><h1>Privacidade do Agendamento</h1><p className="legal-updated">Última atualização: 13 de setembro de 2026</p>
    <section><h2>1. Sobre esta política</h2><p>Esta política explica como o AWS Student Builder Group da Universidade Vila Velha trata os dados utilizados no agendamento do onboarding do processo seletivo.</p></section>
    <section><h2>2. Dados tratados</h2><p>Tratamos nome, endereço de e-mail, horário selecionado, informações da reserva e, quando registrado pela equipe, resultado e feedback do processo seletivo.</p></section>
    <section><h2>3. Finalidades</h2><p>Os dados são utilizados para validar a inscrição, organizar os horários, criar o evento no Google Agenda, gerar o Google Meet, enviar o convite e acompanhar as etapas do processo seletivo.</p></section>
    <section><h2>4. Serviços utilizados</h2><p>O sistema utiliza Supabase para armazenamento e autenticação administrativa, Google Calendar e Google Meet para os encontros e Vercel para hospedagem. Esses fornecedores podem tratar dados conforme suas próprias políticas.</p></section>
    <section><h2>5. Compartilhamento e segurança</h2><p>Os dados não são comercializados. O acesso administrativo é restrito à equipe responsável, com controles técnicos destinados a limitar o acesso e proteger as reservas.</p></section>
    <section><h2>6. Retenção e direitos</h2><p>Os dados são mantidos durante o processo seletivo e pelo período necessário à organização e prestação de contas. Você pode solicitar confirmação do tratamento, acesso, correção e, quando aplicável, eliminação dos dados ou outras medidas previstas na legislação.</p></section>
    <section><h2>7. Contato</h2><p>Para dúvidas ou solicitações, escreva para <a href="mailto:awssbg.uvv@gmail.com">awssbg.uvv@gmail.com</a>.</p></section>
    <Link className="legal-back" href="/agendamento">← Voltar para o agendamento</Link>
  </div></main>;
}
