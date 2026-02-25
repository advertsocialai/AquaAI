import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/spline-scene";
import { PulsingRings } from "@/components/ui/pulsing-rings";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export function Hero() {
  const stats = [
    { value: "500K+", label: "Biomarkers Analyzed" },
    { value: "12+", label: "Research Partners" },
    { value: "99.2%", label: "Model Accuracy" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <GradientBlob />
      
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), 
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="hsl(210, 100%, 50%)" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now Pioneering Longevity AI
              </span>
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <motion.span className="block text-gradient-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>Decoding</motion.span>
                <motion.span className="block text-gradient-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>the Science of</motion.span>
                <motion.span className="block text-gradient-accent" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>Longevity</motion.span>
              </h1>
            </div>

            <motion.p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              We build AI-powered tools that turn complex biological data into actionable insights—advancing healthspan research and personalized medicine.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
              <MagneticButton>
                <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base">
                  <span className="relative z-10 flex items-center gap-2">Explore Our Research <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button size="lg" variant="outline" className="group border-border/50 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-base backdrop-blur-sm">
                  <span className="flex items-center gap-2">See Bio Age Demo <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
                </Button>
              </MagneticButton>
            </motion.div>

            <motion.div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/30" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
              {stats.map((stat, index) => (
                <motion.div key={stat.label} className="space-y-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}>
                  <div className="text-2xl md:text-3xl font-bold text-gradient-accent"><AnimatedCounter value={stat.value} duration={2000 + index * 200} /></div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="relative h-[500px] lg:h-[600px]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
            <motion.div className="absolute -bottom-10 -right-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
              <PulsingRings />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
