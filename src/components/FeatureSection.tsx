"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Bell,
  IndianRupee,
  Activity,
  BookOpen,
  FileBarChart,
} from "lucide-react";

const tasks = [
  {
    title: "Outbreak alerts",
    subtitle: "District-level disease warnings",
    icon: <Bell className="w-4 h-4" />,
  },
  {
    title: "Live mandi prices",
    subtitle: "Refreshed through the day",
    icon: <IndianRupee className="w-4 h-4" />,
  },
  {
    title: "Pond insights",
    subtitle: "Water quality in real-time",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    title: "Knowledge feed",
    subtitle: "AI-curated articles & schemes",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    title: "Cycle reports",
    subtitle: "FCR & performance, weekly",
    icon: <FileBarChart className="w-4 h-4" />,
  },
];

export default function FeatureSection() {
  return (
    <section className="relative w-full py-20 px-4 bg-background text-foreground">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* LEFT SIDE - Task Loop with Vertical Bar */}
        <div className="relative w-full max-w-sm">
          <Card className="overflow-hidden bg-muted/30 backdrop-blur-md shadow-xl rounded-lg">
            <CardContent className="relative h-[320px] p-0 overflow-hidden">
              {/* Scrollable Container */}
              <div className="relative h-full overflow-hidden">
                {/* Motion list */}
                <motion.div
                  className="flex flex-col gap-2 absolute w-full"
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 14,
                    ease: "linear",
                  }}
                >
                  {[...tasks, ...tasks].map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 border-b border-border relative"
                    >
                      {/* Icon + Content */}
                      <div className="flex items-center justify-between flex-1">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted w-10 h-10 rounded-xl shadow-md" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-primary">{task.icon}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Fade effect only inside card */}
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background via-background/70 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE - Content */}
        <div className="space-y-6">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            Built for your farm
          </Badge>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
            Everything your pond needs{" "}
            <span className="text-muted-foreground font-normal text-base md:text-lg">
              — Aqua Rudra puts diagnostics, prices, advisory, and outbreak alerts
              in one place. On-device AI works offline, in your language, so every
              decision is faster and backed by data.
            </span>
          </h3>

          <div className="flex gap-3 flex-wrap">
            <Badge className="px-4 py-2 text-sm">On-device AI</Badge>
            <Badge className="px-4 py-2 text-sm">Works offline</Badge>
            <Badge className="px-4 py-2 text-sm">11+ languages</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
