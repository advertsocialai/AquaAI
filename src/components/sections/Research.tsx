import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, GitBranch, BarChart3, Users } from 'lucide-react';

const pillars = [
  {
    icon: FileText,
    title: "Publications",
    stat: "12+",
    description: "Peer-reviewed papers in top journals including Nature Aging and Cell Reports.",
  },
  {
    icon: GitBranch,
    title: "Open Models",
    stat: "5",
    description: "Foundation models released for the research community under permissive licenses.",
  },
  {
    icon: BarChart3,
    title: "Benchmarks",
    stat: "3",
    description: "Industry-standard benchmarks for bio-age and longevity prediction evaluation.",
  },
  {
    icon: Users,
    title: "Collaborations",
    stat: "20+",
    description: "Active partnerships with leading research institutions worldwide.",
  },
];

export function Research() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-mono text-sm tracking-wider uppercase mb-4 block">
              Research-First
            </span>
            <h2 className="text-display-md md:text-display-lg font-bold text-gradient-hero mb-6">
              Science at
              <br />
              the Core
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We believe breakthrough AI comes from rigorous science. Our work is grounded in
              peer-reviewed research, open benchmarks, and reproducible experiments.
            </p>
            <p className="text-muted-foreground mb-8">
              Every model we deploy has been validated through extensive testing, and we
              regularly publish our findings to advance the field. Transparency and
              scientific integrity are non-negotiable.
            </p>

            {/* Publication preview */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-xs text-primary font-mono mb-2">LATEST PUBLICATION</p>
                <h4 className="font-semibold text-foreground mb-2">
                  Multi-Modal Deep Learning for Biological Age Estimation
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Nature Aging • December 2024
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>↗ 2.4K Citations</span>
                  <span>📊 Open Data</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right side - Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full group">
                  <CardContent className="p-6">
                    <pillar.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-4xl font-bold text-foreground mb-1">
                      {pillar.stat}
                    </p>
                    <p className="text-lg font-semibold text-foreground mb-2">
                      {pillar.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
