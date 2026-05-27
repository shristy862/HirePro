import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { MarketingNav } from "@/components/landing/marketing-nav";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <section id="how-it-works" className="border-y bg-muted/30 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <ol className="mt-12 space-y-8 text-left">
              {[
                {
                  step: "01",
                  title: "Post or discover jobs",
                  desc: "Recruiters create AI-optimized listings. Candidates browse matched opportunities.",
                },
                {
                  step: "02",
                  title: "AI screens & ranks",
                  desc: "Our models parse resumes, score fit, and surface top candidates automatically.",
                },
                {
                  step: "03",
                  title: "Hire with confidence",
                  desc: "Collaborate, interview, and extend offers — with analytics at every step.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
            <p className="mt-4 text-muted-foreground">
              Start free. Scale as you grow. Enterprise plans available.
            </p>
            <div className="mt-12 rounded-2xl border bg-card p-8 shadow-lg">
              <p className="text-4xl font-bold">
                $49<span className="text-lg font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="mt-2 text-muted-foreground">Per recruiter seat · Unlimited jobs</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
