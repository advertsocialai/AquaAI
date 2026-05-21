import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { SplashScreen } from "@/components/SplashScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TechnologyPage from "./pages/TechnologyPage";
import BioAgePage from "./pages/BioAgePage";
import FoundersPage from "./pages/FoundersPage";
import CollaboratePage from "./pages/CollaboratePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AquaAIPage from "./pages/AquaAIPage";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/technology" element={<PageTransition><TechnologyPage /></PageTransition>} />
        <Route path="/bioage" element={<PageTransition><BioAgePage /></PageTransition>} />
        <Route path="/founders" element={<PageTransition><FoundersPage /></PageTransition>} />
        <Route path="/collaborate" element={<PageTransition><CollaboratePage /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/aquaai" element={<PageTransition><AquaAIPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("bohrx-entered")
  );

  const handleEnter = () => {
    sessionStorage.setItem("bohrx-entered", "true");
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <ScrollProgress />
        <NoiseTexture />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
