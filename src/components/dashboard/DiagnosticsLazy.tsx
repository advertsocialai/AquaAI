import { SeedScanner } from '@/components/SeedScanner';
import { DiagnosisDemo } from '@/components/DiagnosisDemo';
import { GradCamViewer } from '@/components/GradCamViewer';
import { BatchExtrapolator } from '@/components/BatchExtrapolator';
import { CertificateVerify } from '@/components/CertificateVerify';
import { OutbreakMap } from '@/components/OutbreakMap';
import { WaterQualityPanel } from '@/components/WaterQualityPanel';
import { ContinuousLearning } from '@/components/ContinuousLearning';

export default function DiagnosticsLazy() {
  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Seed Counter</div>
          <SeedScanner />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Disease &amp; Quality</div>
          <DiagnosisDemo />
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Explainable AI (Grad-CAM)</div>
        <GradCamViewer />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Batch Extrapolation</div>
        <BatchExtrapolator />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Tamper-Evident QC Certificate</div>
        <CertificateVerify />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Outbreak Map</div>
          <OutbreakMap />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Water Quality</div>
          <WaterQualityPanel />
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Continuous Learning</div>
        <ContinuousLearning />
      </div>
    </div>
  );
}
