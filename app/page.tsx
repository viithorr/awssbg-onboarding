import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { createAdminClient } from "@/lib/supabase/admin";
import { AboutGroup } from "@/components/about-group";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data } = await createAdminClient().from("candidates").select("id,name").eq("active", true).order("name");
  return (
    <div className="site-shell">
      <Header />
      <main className="page-width">
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow"><span aria-hidden="true">▣</span> Onboarding individual</p>
          <h1 id="page-title">Agende seu <span>onboarding</span></h1>
          <p>Esta é uma etapa obrigatória do processo seletivo para o Core Team 2026/2027.</p>
        </section>
        <OnboardingFlow candidates={data ?? []} />
        <AboutGroup />
      </main>
      <Footer />
    </div>
  );
}
