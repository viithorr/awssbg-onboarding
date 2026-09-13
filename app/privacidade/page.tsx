import Link from "next/link";

export const metadata = { title: "Política de Privacidade | AWS SBG UVV" };

export default function PrivacyPage() {
  return <main className="legal-page"><div className="legal-window"><p className="eyebrow"><span>▣</span> AWS SBG UVV</p><h1>Política de Privacidade</h1><p className="legal-updated">Última atualização: 13 de setembro de 2026</p>
    <section><h2>1. Sobre esta política</h2><p>Esta política explica como o site público do AWS Student Builder Group da Universidade Vila Velha trata informações durante sua navegação.</p></section>
    <section><h2>2. Informações técnicas</h2><p>A infraestrutura de hospedagem pode registrar automaticamente dados técnicos, como endereço IP, navegador, dispositivo, páginas acessadas, data e horário, para segurança, diagnóstico e funcionamento do site.</p></section>
    <section><h2>3. Links e canais externos</h2><p>O site contém links para Instagram, Meetup e WhatsApp. Ao acessar esses serviços, o tratamento das informações passa a seguir também as políticas de privacidade de cada plataforma.</p></section>
    <section><h2>4. Uso e compartilhamento</h2><p>Não comercializamos dados pessoais. Informações técnicas podem ser tratadas pelos fornecedores responsáveis pela hospedagem e segurança, estritamente para disponibilizar e proteger o site.</p></section>
    <section><h2>5. Segurança e retenção</h2><p>Adotamos medidas razoáveis para proteger o site. Registros técnicos são mantidos apenas pelo período necessário às finalidades operacionais, de segurança e ao cumprimento de obrigações aplicáveis.</p></section>
    <section><h2>6. Seus direitos</h2><p>Você pode solicitar confirmação do tratamento, acesso, correção e, quando aplicável, eliminação dos dados ou outras medidas previstas na legislação.</p></section>
    <section><h2>7. Contato</h2><p>Para dúvidas ou solicitações sobre privacidade, escreva para <a href="mailto:awssbg.uvv@gmail.com">awssbg.uvv@gmail.com</a>.</p></section>
    <Link className="legal-back" href="/">← Voltar para a Home</Link>
  </div></main>;
}
