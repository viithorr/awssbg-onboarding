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
            <h1 id="home-title">Seja bem-<span>vindo</span></h1>
            <p className="home-subtitle">Faça parte da nossa comunidade no Campus UVV</p>
            <a className="community-cta" href="#sobre">Entrar na comunidade</a>
            <p className="home-motto">Learn. Build. Connect. <span aria-hidden="true">♜</span></p>
          </div>
        </section>
        <div className="page-width"><AboutGroup /><ContactSection /></div>
      </main>
      <Footer />
    </div>
  );
}
