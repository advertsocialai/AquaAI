import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { SpotlightCursor } from '@/components/ui/spotlight-cursor';
import { Cpu, HeartPulse, FlaskConical, Server } from 'lucide-react';

const products = [
  {
    icon: Cpu,
    title: "Bio-Age Prediction Models",
    description: "State-of-the-art deep learning models trained on millions of biological samples to predict your true age with unprecedented accuracy.",
    tags: ["Deep Learning", "Multimodal AI", "Precision Medicine"],
  },
  {
    icon: HeartPulse,
    title: "Longevity Intelligence Systems",
    description: "Comprehensive platforms that combine bio-age with risk stratification, intervention recommendations, and progress tracking.",
    tags: ["Health Analytics", "Risk Prediction", "Personalization"],
  },
  {
    icon: FlaskConical,
    title: "Scientific & Research AI",
    description: "Tools for researchers to accelerate longevity science—from experiment design to publication-ready analysis.",
    tags: ["Research Tools", "Data Analysis", "Collaboration"],
  },
  {
    icon: Server,
    title: "Scalable AI Infrastructure",
    description: "Enterprise-grade infrastructure built for healthcare and research institutions handling sensitive biological data.",
    tags: ["HIPAA Compliant", "On-Premise", "API-First"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export function WhatWeBuilt() {
  return (
    <section className="py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
            Our Technology
          </span>
          <h2 className="text-display-md md:text-display-lg font-bold text-gradient-hero mb-6">
            What BhorX.ai Builds
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From research-grade models to production systems, we build the full stack
            of longevity AI infrastructure.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {products.map((product, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-500 h-full group relative overflow-hidden">
                <SpotlightCursor size={300} />
                <CardContent className="p-8 md:p-10 relative z-10">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-300">
                      <product.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
