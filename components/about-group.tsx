import { ExternalLink, Instagram, MapPinned } from "lucide-react";

const meetupUrl = "https://www.meetup.com/aws-sbg-at-university-vila-velha/?utm_medium=email&utm_source=braze_canvas&utm_campaign=mmrk_alleng_new_group_announcement_prod_v7_en&utm_term=promo&utm_content=lp_meetup&dispatch_id=6a510f7cbfcb2e17879280d5b3709338";

export function AboutGroup() {
  return <section className="about-group" id="sobre" aria-labelledby="about-title">
    <div className="about-heading"><p className="eyebrow"><span aria-hidden="true">▣</span> Nossa comunidade</p><h2 id="about-title">Sobre o <span>AWS SBG UVV</span></h2><p>Um espaço para aprender, construir e se conectar com pessoas interessadas em cloud e tecnologia dentro da Universidade Vila Velha.</p></div>
    <div className="about-grid">
      <SocialCard icon={<Instagram />} title="Instagram" description="Acompanhe novidades, conteúdos e os bastidores do grupo." href="https://www.instagram.com/aws.sbg.uvv/" qr="/qr-instagram.svg" action="Seguir @aws.sbg.uvv" />
      <SocialCard icon={<MapPinned />} title="Meetup" description="Entre na comunidade e receba os próximos eventos e encontros." href={meetupUrl} qr="/qr-meetup.svg" action="Participar no Meetup" />
      <article className="leader-card"><div className="leader-photo"><img src="/vitorfoto.svg" alt="Vithor Torelli, Group Leader do AWS SBG UVV" /></div><div className="leader-copy"><p>GROUP LEADER</p><h3>Vithor Torelli</h3><span>Responsável pelo AWS Student Builder Group na UVV.</span><a href="https://www.instagram.com/vithortorelli/" target="_blank" rel="noreferrer"><Instagram /> Ver perfil <ExternalLink /></a></div></article>
    </div>
  </section>;
}

function SocialCard({ icon, title, description, href, qr, action }: { icon: React.ReactNode; title: string; description: string; href: string; qr: string; action: string }) {
  return <article className="social-card"><div className="social-card-top"><span>{icon}</span><div><h3>{title}</h3><p>{description}</p></div></div><a className="qr-link" href={href} target="_blank" rel="noreferrer"><img src={qr} alt={`QR Code para ${title}`} width="132" height="132" /><span>{action} <ExternalLink /></span></a></article>;
}
