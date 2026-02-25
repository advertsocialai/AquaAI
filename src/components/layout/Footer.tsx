import { Twitter, Linkedin, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import bhorxLogo from "@/assets/bhorx-logo.png";

const footerLinks = {
  research: [
    { label: "Publications", href: "#" },
    { label: "Datasets", href: "#" },
    { label: "API Documentation", href: "#" },
    { label: "Open Source", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-background">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border/30">
                <img src={bhorxLogo} alt="BhorX.ai Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-xl font-bold">BhorX<span className="text-primary">.ai</span></span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Pioneering AI-driven longevity research to extend healthy human lifespan through computational biology and precision medicine.
            </p>
            <div className="space-y-3">
              <p className="text-sm font-medium">Stay updated on our research</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                <Button size="sm" className="px-4"><ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Research</h4>
            <ul className="space-y-3">
              {footerLinks.research.map((link) => (
                <li key={link.label}><a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}><a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}><a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BhorX.ai — Advancing the science of longevity.</p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <motion.a key={social.label} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-lg bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
