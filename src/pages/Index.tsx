import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { WhatWeBuilt } from "@/components/sections/WhatWeBuilt";
import { Research } from "@/components/sections/Research";
import { BioAge } from "@/components/sections/BioAge";
import { Collaboration } from "@/components/sections/Collaboration";
import { Footer } from "@/components/layout/Footer";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { SplashScreen } from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleEnter = () => {
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen onEnter={handleEnter} />}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && (
          <motion.div
            className="min-h-screen bg-background relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <NoiseTexture />
            <Header />
            <main>
              <Hero />
              <WhatWeBuilt />
              <Research />
              <BioAge />
              <Collaboration />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
