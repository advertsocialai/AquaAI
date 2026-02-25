import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { WhatWeBuilt } from "@/components/sections/WhatWeBuilt";
import { Research } from "@/components/sections/Research";
import { BioAge } from "@/components/sections/BioAge";
import { Collaboration } from "@/components/sections/Collaboration";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black relative">
      <Header />
      <main>
        <Hero />
        <WhatWeBuilt />
        <Research />
        <BioAge />
        <Collaboration />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
