import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const Section = ({ children, className, id }: SectionProps) => (
  <section className={cn("py-8 md:py-12", className)} id={id}>
    {children}
  </section>
);

const Container = ({ children, className, id }: ContainerProps) => (
  <div className={cn("mx-auto max-w-5xl p-6 sm:p-8", className)} id={id}>
    {children}
  </div>
);
/* ================================================ */

type CTAProps = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
};

export default function CTA({
  title = "Decode every pond with AI",
  subtitle = "On-device diagnostics, live mandi prices, and a verified marketplace — built for India's aquaculture.",
  primaryLabel = "Get Started",
  primaryTo = "/signup",
  secondaryLabel = "Learn More",
  secondaryTo = "/aquaai",
}: CTAProps) {
  return (
    <Section>
      <Container className="flex flex-col gap-6">
        <h2 className="my-0 text-3xl md:text-4xl font-bold text-balance">{title}</h2>
        <h4 className="text-muted-foreground text-base md:text-lg text-balance">
          {subtitle}
        </h4>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to={primaryTo}>{primaryLabel}</Link>
          </Button>
          <Button variant="link" asChild>
            <Link to={secondaryTo}>{secondaryLabel} {"->"}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
