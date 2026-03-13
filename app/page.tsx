import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero";
import { LogoCloud } from "@/components/marketing/logo-cloud";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Services } from "@/components/marketing/services";
import { Results } from "@/components/marketing/results";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <LogoCloud />
      <HowItWorks />
      <Services />
      <Results />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
