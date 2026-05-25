import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AquaDashboard } from '@/components/dashboard/AquaDashboard';
import {
  Fish, Microscope, WifiOff, Activity, Layers,
  BrainCircuit, Zap, FlaskConical, Camera,
} from 'lucide-react';

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <motion.div
      className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20`}
           style={{ background: color }} />
      <Icon className="w-6 h-6 mb-3" style={{ color }} />
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/50">{label}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </motion.div>
  );
}

// ── AI Model accuracy table ────────────────────────────────────────────────────

function AccuracyTable() {
  const rows = [
    { model: 'EfficientNetB0', task: 'EHP Classification', metric: 'Accuracy', target: '90-95%', method: 'vs PCR ground truth' },
    { model: 'YOLOv8 Nano', task: 'Seed Counter', metric: 'Count MAPE', target: '<5%', method: 'vs manual count' },
    { model: 'YOLOv8 Nano', task: 'Spore Detector', metric: 'mAP@50', target: '>85%', method: 'vs histopathology' },
    { model: 'MobileNetV3', task: 'PL Stage ID', metric: 'Accuracy', target: '90%', method: 'per PL stage class' },
    { model: 'EfficientNetB0', task: 'Visual Health', metric: 'MAE', target: '<2.5 pts', method: 'expert scored test set' },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {['Model', 'Task', 'Metric', 'Target', 'Validation'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-violet-300">{r.model}</td>
              <td className="px-4 py-3 text-white/80">{r.task}</td>
              <td className="px-4 py-3 text-white/50">{r.metric}</td>
              <td className="px-4 py-3 font-bold text-emerald-400">{r.target}</td>
              <td className="px-4 py-3 text-white/40 text-xs">{r.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const AquaAIPage = () => {
  useEffect(() => { document.title = "Aqua AI — Aquaculture Intelligence"; }, []);

  const mlPipeline = [
    { step: '01', title: 'Capture', desc: '3-frame burst from overhead/monochrome camera. Blur + brightness quality gate applied before inference.' },
    { step: '02', title: 'Preprocess', desc: 'Y-channel extraction → CLAHE contrast enhancement → letterbox resize → INT8 normalisation.' },
    { step: '03', title: 'Infer', desc: 'YOLOv8n / EfficientNetB0 / MobileNetV3 on-device TFLite. <30ms per frame on mid-range Android.' },
    { step: '04', title: 'Fuse', desc: 'Multi-signal fusion: HP tissue 50% + spore detection 35% + size CV 15%. Multi-frame ensemble averages 3 frames.' },
    { step: '05', title: 'Certify', desc: 'Composite score → grade → HMAC-signed PDF certificate with QR verification link.' },
    { step: '06', title: 'Learn', desc: 'PCR ground truth feedback queues into training pipeline. Auto-retrain at 50 confirmed samples per model. OTA push to all devices.' },
  ];

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/10 via-black to-[#a78bfa]/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-xs tracking-widest uppercase mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Fish className="w-3.5 h-3.5" />
              Aquaculture AI Platform
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              AquaAI
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                Shrimp Seed
              </span>
              Diagnostics
            </motion.h1>

            <motion.p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              AI-powered Post-Larvae diagnostics platform. 32 features across 4 modules.
              On-device TFLite inference — 100% offline. YOLOv8 Nano + EfficientNetB0 +
              MobileNetV3 running on any Android ₹8,000 phone.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {[
                { label: '32 Features', icon: Layers },
                { label: '4 AI Models', icon: BrainCircuit },
                { label: '100% Offline', icon: WifiOff },
                { label: '<30ms Inference', icon: Zap },
              ].map(({ label, icon: Icon }) => (
                <div key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/70">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="AI Models" value="5" sub="YOLOv8n + EfficientNetB0 + MobileNetV3" icon={BrainCircuit} color="#a78bfa" />
            <StatCard label="Disease Detection" value="6" sub="EHP, WSSV, AHPND, BGD, HPV, WFS" icon={FlaskConical} color="#f87171" />
            <StatCard label="Count Accuracy" value="<5%" sub="MAPE vs manual count" icon={Activity} color="#38bdf8" />
            <StatCard label="Diagnosis Accuracy" value="90-95%" sub="vs PCR ground truth" icon={Microscope} color="#34d399" />
          </div>
        </div>
      </section>

      {/* Unified Dashboard — 6 modules × 8 roles */}
      <section id="dashboard" className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div className="mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs text-white/30 uppercase tracking-widest mb-4">AquaI Platform</div>
            <h2 className="text-4xl md:text-5xl font-bold">Unified Dashboard<br />
              <span className="text-white/40">6 Modules · 8 Roles</span>
            </h2>
            <p className="text-white/40 mt-3 text-sm max-w-2xl">
              Switch roles to see role-specific access. Each module is a self-contained surface:
              onboarding, diagnostics, pricing, marketplace, logistics, advisory.
            </p>
          </motion.div>
          <AquaDashboard />
        </div>
      </section>

      {/* ML Pipeline */}
      <section className="py-24 border-t border-white/5 bg-white/2">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div className="mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs text-white/30 uppercase tracking-widest mb-4">How It Works</div>
            <h2 className="text-4xl md:text-5xl font-bold">End-to-End<br /><span className="text-white/40">ML Pipeline</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mlPipeline.map(({ step, title, desc }) => (
              <motion.div key={step}
                className="p-6 rounded-2xl border border-white/10 bg-white/5"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className="text-5xl font-bold text-white/8 mb-4 font-mono">{step}</div>
                <div className="text-lg font-semibold text-white mb-2">{title}</div>
                <div className="text-sm text-white/50 leading-relaxed">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accuracy Table */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div className="mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Performance</div>
            <h2 className="text-4xl font-bold">Model Accuracy Targets</h2>
            <p className="text-white/40 mt-3 text-sm max-w-xl">
              All targets from AI_Model_Implementation_Guide. Validated against PCR-confirmed test sets and manual count ground truth.
            </p>
          </motion.div>
          <AccuracyTable />
        </div>
      </section>


      {/* Tech Stack */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div className="mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Stack</div>
            <h2 className="text-4xl font-bold">Technology</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Flutter', desc: 'Android-first mobile app', icon: Camera },
              { label: 'TFLite INT8', desc: '5 on-device models <10MB', icon: BrainCircuit },
              { label: 'FastAPI', desc: '72 endpoints, async', icon: Zap },
              { label: 'PostgreSQL', desc: 'Farm + QC records', icon: Layers },
              { label: 'YOLOv8 Nano', desc: 'Seed count + spore detection', icon: Activity },
              { label: 'EfficientNetB0', desc: 'EHP + visual health', icon: Microscope },
              { label: 'MobileNetV3', desc: 'PL stage classification', icon: FlaskConical },
              { label: 'SQLite/Drift', desc: '100% offline operation', icon: WifiOff },
            ].map(({ label, desc, icon: Icon }) => (
              <motion.div key={label}
                className="p-5 rounded-xl border border-white/10 bg-white/5"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Icon className="w-5 h-5 text-cyan-400 mb-3" />
                <div className="font-semibold text-white text-sm">{label}</div>
                <div className="text-xs text-white/40 mt-1">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AquaAIPage;
