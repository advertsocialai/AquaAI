import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ChatBot } from "@/components/ChatBot";
import { VoiceReader } from "@/components/VoiceReader";
import { IosInstallPrompt } from "@/components/IosInstallPrompt";
import { PageTransition } from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load every heavy route — keeps the first JS payload small and
// the splash-to-interactive time on slow networks low.
const FoundersPage    = lazy(() => import("./pages/FoundersPage"));
const PrivacyPage     = lazy(() => import("./pages/PrivacyPage"));
const TermsPage       = lazy(() => import("./pages/TermsPage"));
const AquaAIPage      = lazy(() => import("./pages/AquaAIPage"));
const LoginPage       = lazy(() => import("./pages/LoginPage"));
const SignupPage      = lazy(() => import("./pages/SignupPage"));
const SettingsPage    = lazy(() => import("./pages/SettingsPage"));
const KycPage         = lazy(() => import("./pages/KycPage"));
const VerifyPage      = lazy(() => import("./pages/VerifyPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const CareersPage     = lazy(() => import("./pages/CareersPage"));
const ContactPage     = lazy(() => import("./pages/ContactPage"));
const KnowledgePage   = lazy(() => import("./pages/KnowledgePage"));
const KnowledgeArticlePage = lazy(() => import("./pages/KnowledgeArticlePage"));
const AboutPage       = lazy(() => import("./pages/AboutPage"));
const FarmerDashboardPage = lazy(() => import("./pages/FarmerDashboardPage"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-foreground/40 text-sm">
        <div className="w-4 h-4 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
        Loading…
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Hash links (e.g. /#download-app) should jump to the anchor, not the top.
    if (hash) {
      const id = hash.slice(1);
      // Wait for the target page's lazy chunk + layout to settle.
      const attempt = (tries: number) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (tries > 0) {
          setTimeout(() => attempt(tries - 1), 120);
        }
      };
      attempt(8);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/technology" element={<Navigate to="/aquaai" replace />} />
          <Route path="/bioage" element={<Navigate to="/aquaai" replace />} />
          <Route path="/founders" element={<PageTransition><FoundersPage /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
          <Route path="/aquaai" element={<PageTransition><AquaAIPage /></PageTransition>} />
          <Route path="/farmer" element={<PageTransition><FarmerDashboardPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
          <Route path="/kyc" element={<PageTransition><KycPage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
          <Route path="/verify/:certId" element={<PageTransition><VerifyPage /></PageTransition>} />
          <Route path="/careers" element={<PageTransition><CareersPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/collaborate" element={<Navigate to="/contact" replace />} />
          <Route path="/knowledge" element={<PageTransition><KnowledgePage /></PageTransition>} />
          <Route path="/knowledge/:slug" element={<PageTransition><KnowledgeArticlePage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollProgress />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
          <ChatBot />
          <VoiceReader />
          <IosInstallPrompt />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
