import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { WhatWeBuilt } from "@/components/sections/WhatWeBuilt";
import { Mission } from "@/components/sections/Mission";
import { Research } from "@/components/sections/Research";
import { Stats } from "@/components/sections/Stats";
import { Pipeline } from "@/components/sections/Pipeline";
import { BioAge } from "@/components/sections/BioAge";
import { Alzheimers } from "@/components/sections/Alzheimers";
import { Collaboration } from "@/components/sections/Collaboration";
import { Partners } from "@/components/sections/Partners";
import { Timeline } from "@/components/sections/Timeline";
import { FoundersSection } from "@/components/sections/FoundersSection";
import { Footer } from "@/components/layout/Footer";
import { SectionIndicator } from "@/components/ui/section-indicator";

const Index = () => {
  return (
    <div className="min-h-screen bg-black relative md:snap-y md:snap-proximity">
      <Header />
      <main>
        <div data-section="1"><Hero /></div>
        <div data-section="2"><WhatWeBuilt /></div>
        <div data-section="3"><Mission /></div>
        <div data-section="4"><Research /></div>
        <div data-section="5"><Stats /></div>
        <div data-section="6"><Pipeline /></div>
        <div data-section="7"><BioAge /></div>
        <div data-section="8"><Alzheimers /></div>
        <div data-section="9"><Collaboration /></div>
        <div data-section="10"><Partners /></div>
        <div data-section="11"><Timeline /></div>
        <div data-section="12"><FoundersSection /></div>
      </main>
      <Footer />
      <SectionIndicator totalSections={12} />
    </div>
  );
};

export default Index;
