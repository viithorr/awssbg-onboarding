import Link from "next/link";

export const metadata = { title: "Política de Privacidade | AWS SBG UVV" };

export default function PrivacyPage() {
  return <main className="legal-page"><div className="legal-window"><p className="eyebrow"><span>▣</span> AWS SBG UVV</p><h1>Política de Privacidade</h1><p className="legal-updated">Última atualização: 1º de setembro de 2026</p>
    <section><h2>1. Sobre esta política</h2><p>Esta política explica como o AWS Student Builder Group da Universidade Vila Velha trata os dados utilizados no agendamento do onboarding do processo seletivo.</p></section>
    <section><h2>2. Dados tratados</h2><p>Tratamos nome, endereço de e-mail, horário selecionado, informações da reserva e, quando publicado pela equipe, resultado e feedback do processo seletivo.</p></section>
    <section><h2>3. Finalidades</h2><p>Os dados são utilizados para validar a inscrição, organizar os horários, criar o evento no Google Agenda, gerar o Google Meet, enviar o convite e acompanhar as etapas do processo seletivo.</p></section>
    <section><h2>4. Serviços utilizados</h2><p>O sistema utiliza Supabase para armazenamento e autenticação administrativa, Google Calendar e Google Meet para os encontros e Vercel para hospedagem da aplicação. Esses fornecedores podem tratar dados conforme suas próprias políticas.</p></section>
    <section><h2>5. Compartilhamento e segurança</h2><p>Os dados não são comercializados. O acesso administrativo é restrito à equipe responsável. Aplicamos controles técnicos para limitar o acesso e proteger as reservas.</p></section>
    <section><h2>6. Retenção e direitos</h2><p>Os dados são mantidos durante o processo seletivo e pelo período necessário à organização e prestação de contas, sendo posteriormente excluídos ou anonimizados quando não forem mais necessários. Você pode solicitar acesso, correção ou exclusão dos seus dados.</p></section>
    <section><h2>7. Contato</h2><p>Para dúvidas ou solicitações sobre privacidade, escreva para <a href="mailto:awssbg.uvv@gmail.com">awssbg.uvv@gmail.com</a>.</p></section>
    <Link className="legal-back" href="/">← Voltar para o agendamento</Link>
  </div></main>;
}
