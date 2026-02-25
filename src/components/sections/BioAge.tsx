import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Dna, Activity, Brain } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: "Chronological vs Biological",
    description: "Your biological age reflects the true state of your body, often differing significantly from your birth date.",
  },
  {
    icon: Dna,
    title: "Epigenetic Markers",
    description: "We analyze DNA methylation patterns and epigenetic clocks to determine cellular aging with precision.",
  },
  {
    icon: Activity,
    title: "Multimodal Biomarkers",
    description: "Blood panels, metabolomics, proteomics, and imaging data are integrated for comprehensive analysis.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Deep learning models process thousands of data points to generate accurate, personalized predictions.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function BioAge() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Subtle gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
            Bio-Age Intelligence
          </span>
          <h2 className="text-display-md md:text-display-lg font-bold text-gradient-hero mb-6">
            Understanding Your
            <br />
            Biological Clock
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Biological age is the truest measure of your health and longevity potential.
            Our AI systems decode the signals hidden in your biology.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative"
        >
          <Card className="bg-card border-border p-8 md:p-12 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  The Gap That Matters
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  A 45-year-old with excellent health habits might have a biological age of 38,
                  while another 45-year-old could biologically be 52. This gap predicts health outcomes
                  better than any single biomarker.
                </p>
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-muted-foreground">45</p>
                    <p className="text-sm text-muted-foreground mt-1">Chronological</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gradient-accent">38</p>
                    <p className="text-sm text-primary mt-1">Biological</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-accent">-7 yrs</p>
                    <p className="text-sm text-accent mt-1">Younger</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative h-64 w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full border-4 border-muted animate-pulse-glow" />
                    <div className="absolute inset-4 rounded-full border-4 border-primary glow-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-bold text-gradient-accent">38</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
