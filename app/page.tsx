import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AboutGroup } from "@/components/about-group";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <div className="site-shell home-shell">
      <Header home />
      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="page-width home-hero-inner">
            <p className="home-kicker">AWS STUDENT BUILDER GROUP • UVV</p>
            <h1 id="home-title">Sejam <span className="home-title-rest">bem-vindos</span></h1>
            <p className="home-subtitle">Faça parte da nossa comunidade no Campus UVV</p>
            <a className="community-cta" href="https://chat.whatsapp.com/Cu8CoM34KEL8jCfUHJPoeb" target="_blank" rel="noreferrer">Entrar na comunidade</a>
            <p className="home-motto">Learn. Build. Connect. <img src="/trofeu-icon.svg" alt="" aria-hidden="true" /></p>
          </div>
        </section>
        <div className="page-width"><AboutGroup /><ContactSection /></div>
      </main>
      <Footer />
    </div>
  );
}
