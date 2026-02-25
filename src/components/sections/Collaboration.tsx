import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Building2, FlaskConical, TrendingUp } from 'lucide-react';

const audiences = [
  {
    icon: FlaskConical,
    title: "Researchers",
    description: "Access our models, datasets, and collaborate on publications.",
  },
  {
    icon: Building2,
    title: "Labs & Institutions",
    description: "Partner with us to deploy longevity AI in your organization.",
  },
  {
    icon: TrendingUp,
    title: "Investors",
    description: "Join us in building the future of longevity science.",
  },
];

export function Collaboration() {
  return (
    <section className="py-32 bg-secondary/30 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
            Join Us
          </span>
          <h2 className="text-display-md md:text-display-lg font-bold text-gradient-hero mb-6">
            Let's Build the Future
            <br />
            of Longevity Together
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Whether you're a researcher, institution, or investor, we're looking for
            partners who share our vision of extending healthy human lifespan through AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {audiences.map((audience, index) => (
            <Card
              key={index}
              className="bg-card border-border p-8 text-center hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                <audience.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {audience.title}
              </h3>
              <p className="text-muted-foreground">
                {audience.description}
              </p>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Card className="inline-block bg-card border-border p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to collaborate?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get in touch to discuss research partnerships, enterprise solutions, or investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-border hover:bg-secondary"
              >
                View Careers
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
