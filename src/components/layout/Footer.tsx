export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-6">
      <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-white/40 tracking-wider">
          © {new Date().getFullYear()} BOHRX.AI — ADVANCING THE SCIENCE OF LONGEVITY
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider">PRIVACY</a>
          <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider">TERMS</a>
          <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wider">CAREERS</a>
        </div>
      </div>
    </footer>
  );
}
