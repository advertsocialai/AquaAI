import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "Aqua Rudra",
  heading = "One platform for the whole value chain",
  description = "From pond-side diagnostics to export-ready logistics.",
  tabs = [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Diagnostics",
      content: {
        badge: "On-device AI",
        title: "Catch disease before it spreads.",
        description:
          "Snap a sample and get PCR-validated detection of EHP, white-spot and more in under 30 seconds — fully offline, in your language.",
        buttonText: "Try the detector",
        imageSrc: heroBg,
        imageAlt: "AI disease diagnostics",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Pricing",
      content: {
        badge: "Live market data",
        title: "Sell at the right price, every day.",
        description:
          "Real-time mandi and export rates across 31+ species, so you always know what your pond is worth before you sell.",
        buttonText: "See live prices",
        imageSrc: heroBg,
        imageAlt: "Live market prices",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline">{badge}</Badge>
          <h1 className="max-w-2xl text-3xl md:text-4xl font-bold tracking-tight">
            {heading}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5"
              >
                <div className="flex flex-col items-center gap-5">
                  <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl lg:text-5xl font-bold tracking-tight">
                    {tab.content.title}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {tab.content.description}
                  </p>
                  <Button className="mt-2.5 w-fit gap-2" size="lg">
                    {tab.content.buttonText}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
