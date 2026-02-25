import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { WhatWeBuilt } from "@/components/sections/WhatWeBuilt";
import { Research } from "@/components/sections/Research";
import { Stats } from "@/components/sections/Stats";
import { BioAge } from "@/components/sections/BioAge";
import { Alzheimers } from "@/components/sections/Alzheimers";
import { Collaboration } from "@/components/sections/Collaboration";
import { FoundersSection } from "@/components/sections/FoundersSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black relative snap-y snap-proximity overflow-y-auto h-screen">
      <Header />
      <main>
        <Hero />
        <WhatWeBuilt />
        <Research />
        <Stats />
        <BioAge />
        <Alzheimers />
        <Collaboration />
        <FoundersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
