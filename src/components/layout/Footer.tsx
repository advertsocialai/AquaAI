import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-black border-t border-white/10 py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/40 tracking-wider">
            © {new Date().getFullYear()} BOHRX.AI — ADVANCING THE SCIENCE OF LONGEVITY
          </p>

          <div className="flex items-center gap-8">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider">LINKEDIN</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider">X</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider">PRIVACY</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider">TERMS</a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider group"
          >
            BACK TO TOP
            <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
