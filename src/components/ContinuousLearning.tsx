import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Microscope, FlaskConical, MessageSquare, Database, Cpu, ArrowRight } from 'lucide-react';

/**
 * F16 — Continuous-learning loop visualisation.
 * Shows how PCR lab results feed back into the training pipeline,
 * triggering an automatic retrain once 50 confirmed samples accumulate.
 */
const STEPS = [
  { icon: Microscope,    title: 'AI Diagnosis',     desc: 'Field VLE runs an EHP scan',          color: '#38bdf8' },
  { icon: FlaskConical,  title: 'PCR Lab Result',   desc: 'Farmer submits the lab confirmation', color: '#fbbf24' },
  { icon: MessageSquare, title: 'Feedback Logged',  desc: 'AI prediction scored vs. ground truth', color: '#a78bfa' },
  { icon: Database,      title: 'Training Queue',   desc: 'Mislabelled cases get high priority',  color: '#fb923c' },
  { icon: Cpu,           title: 'Auto-Retrain',     desc: 'Triggers at 50 confirmed samples',     color: '#34d399' },
];

export function ContinuousLearning() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1400);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Continuous Learning Loop</h3>
          <p className="text-xs text-foreground/50">
            Every PCR result makes the model sharper — F16
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
          Self-improving
        </span>
      </div>

      <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-center gap-2 shrink-0">
            <motion.div
              animate={{
                scale: active === i ? 1.04 : 1,
                opacity: active === i ? 1 : 0.55,
              }}
              transition={{ duration: 0.4 }}
              className="w-36 rounded-xl border p-3"
              style={{
                borderColor: active === i ? `${s.color}66` : '#ffffff14',
                background: active === i ? `${s.color}14` : 'transparent',
              }}
            >
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <div className="text-sm font-semibold text-foreground">{s.title}</div>
              <div className="text-[10px] text-foreground/45 mt-0.5 leading-snug">{s.desc}</div>
            </motion.div>
            {i < STEPS.length - 1 && (
              <ArrowRight
                className="w-4 h-4 shrink-0 transition-colors"
                style={{ color: active === i ? s.color : '#ffffff22' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Loop-back indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-foreground/40">
        <div className="flex-1 h-px bg-gradient-to-r from-emerald-400/40 to-transparent" />
        <span className="flex items-center gap-1">
          <ArrowRight className="w-3 h-3 rotate-180 text-emerald-400" />
          New model version pushed to all devices via OTA — loop repeats
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { k: 'Retrain threshold', v: '50 samples' },
          { k: 'Priority cases', v: 'AI ≠ PCR' },
          { k: 'Delivery', v: 'OTA push' },
        ].map((x) => (
          <div key={x.k} className="rounded-lg bg-card px-3 py-2 text-center">
            <div className="text-sm font-bold text-foreground">{x.v}</div>
            <div className="text-[10px] text-foreground/40">{x.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
