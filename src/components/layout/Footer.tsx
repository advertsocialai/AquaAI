import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Wordmark */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-[0.15em] mb-3">
            BOHRX.AI
          </h2>
          <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
            Advancing the Science of Longevity
          </p>
          <a
            href="mailto:hello@bohrx.ai"
            className="text-xs text-muted-foreground hover:text-foreground/70 transition-colors tracking-[0.2em] mt-3 inline-block">

            HELLO@BOHRX.AI
          </a>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} BOHRX.AI
          </p>

          <div className="flex items-center gap-8">
            <a target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground/70 transition-colors tracking-wider" href="https://www.linkedin.com/company/bohrx-ai/">LINKEDIN</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground/70 transition-colors tracking-wider">X</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground/70 transition-colors tracking-wider">PRIVACY</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground/70 transition-colors tracking-wider">TERMS</a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground/70 transition-colors tracking-wider group">

            BACK TO TOP
            <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>);

}