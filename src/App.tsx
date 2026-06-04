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
import { AuthProvider } from "@/lib/auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load every heavy route — keeps the first JS payload small and
// the splash-to-interactive time on slow networks low.
const FoundersPage    = lazy(() => import("./pages/FoundersPage"));
const PrivacyPage     = lazy(() => import("./pages/PrivacyPage"));
const TermsPage       = lazy(() => import("./pages/TermsPage"));
const AquaAIPage      = lazy(() => import("./pages/AquaAIPage"));
const AquaToolsPage   = lazy(() => import("./pages/AquaToolsPage"));
const LogisticsPage   = lazy(() => import("./pages/LogisticsPage"));
const LoginPage       = lazy(() => import("./pages/LoginPage"));
const SignupPage      = lazy(() => import("./pages/SignupPage"));
const SettingsPage    = lazy(() => import("./pages/SettingsPage"));
const KycPage         = lazy(() => import("./pages/KycPage"));
const VerifyPage      = lazy(() => import("./pages/VerifyPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ContactPage     = lazy(() => import("./pages/ContactPage"));
const KnowledgePage   = lazy(() => import("./pages/KnowledgePage"));
const KnowledgeArticlePage = lazy(() => import("./pages/KnowledgeArticlePage"));
const AboutPage       = lazy(() => import("./pages/AboutPage"));
const FarmerDashboardPage = lazy(() => import("./pages/FarmerDashboardPage"));
const TraderDashboardPage = lazy(() => import("./pages/TraderDashboardPage"));
const RoleDashboard = lazy(() => import("./pages/dashboards/RoleDashboard"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const MarketPricePage = lazy(() => import("./pages/MarketPricePage"));
const ExpertPage = lazy(() => import("./pages/ExpertPage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const ProfileDetailsPage = lazy(() => import("./pages/ProfileDetailsPage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const LanguagePage = lazy(() => import("./pages/LanguagePage"));
const FavouritesPage = lazy(() => import("./pages/FavouritesPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-foreground/40 text-sm">
        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
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
          <Route path="/tools" element={<PageTransition><AquaToolsPage /></PageTransition>} />
          <Route path="/logistics" element={<PageTransition><LogisticsPage /></PageTransition>} />
          <Route path="/farmer" element={<RequireAuth role="farmer"><PageTransition><FarmerDashboardPage /></PageTransition></RequireAuth>} />
          <Route path="/trader" element={<RequireAuth role="trader"><PageTransition><TraderDashboardPage /></PageTransition></RequireAuth>} />
          <Route path="/vle" element={<RequireAuth role="vle"><PageTransition><RoleDashboard role="vle" /></PageTransition></RequireAuth>} />
          <Route path="/hatchery" element={<RequireAuth role="hatchery"><PageTransition><RoleDashboard role="hatchery" /></PageTransition></RequireAuth>} />
          <Route path="/transporter" element={<RequireAuth role="transporter"><PageTransition><RoleDashboard role="transporter" /></PageTransition></RequireAuth>} />
          <Route path="/supplier" element={<RequireAuth role="supplier"><PageTransition><RoleDashboard role="supplier" /></PageTransition></RequireAuth>} />
          <Route path="/bank" element={<RequireAuth role="bank"><PageTransition><RoleDashboard role="bank" /></PageTransition></RequireAuth>} />
          <Route path="/govt" element={<RequireAuth role="govt"><PageTransition><RoleDashboard role="govt" /></PageTransition></RequireAuth>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
          <Route path="/settings" element={<RequireAuth><PageTransition><SettingsPage /></PageTransition></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><PageTransition><ProfilePage /></PageTransition></RequireAuth>} />
          <Route path="/profile/details" element={<RequireAuth><PageTransition><ProfileDetailsPage /></PageTransition></RequireAuth>} />
          <Route path="/profile/edit" element={<RequireAuth><PageTransition><EditProfilePage /></PageTransition></RequireAuth>} />
          <Route path="/language" element={<RequireAuth><PageTransition><LanguagePage /></PageTransition></RequireAuth>} />
          <Route path="/favourites" element={<RequireAuth><PageTransition><FavouritesPage /></PageTransition></RequireAuth>} />
          <Route path="/explore" element={<RequireAuth><PageTransition><ExplorePage /></PageTransition></RequireAuth>} />
          <Route path="/home" element={<RequireAuth><PageTransition><HomePage /></PageTransition></RequireAuth>} />
          <Route path="/shop" element={<RequireAuth><PageTransition><ShopPage /></PageTransition></RequireAuth>} />
          <Route path="/shop/:productId" element={<RequireAuth><PageTransition><ProductDetailPage /></PageTransition></RequireAuth>} />
          <Route path="/rates" element={<RequireAuth><PageTransition><MarketPricePage /></PageTransition></RequireAuth>} />
          <Route path="/expert" element={<RequireAuth><PageTransition><ExpertPage /></PageTransition></RequireAuth>} />
          <Route path="/kyc" element={<RequireAuth><PageTransition><KycPage /></PageTransition></RequireAuth>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
          <Route path="/verify/:certId" element={<PageTransition><VerifyPage /></PageTransition>} />
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
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
