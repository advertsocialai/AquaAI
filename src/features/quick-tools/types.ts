// Shared types for the Quick Tools feature (Disease detector, Seed counter, Water quality).
export type ToolId = 'seed' | 'disease' | 'water';
export type RiskLevel = 'green' | 'amber' | 'red' | 'inconclusive';
export type FlowStep =
  | 'idle' | 'capturing' | 'processing' | 'result' | 'saved'
  | 'retake' | 'offlineQueued';

/** Per-frame quality check that drives CaptureGuide. */
export interface CaptureQuality {
  focus: number;        // 0..1 (sharpness)
  brightness: number;   // 0..1 (mean luma)
  density: 'ok' | 'too_dense' | 'too_sparse';
  passes: boolean;
  hint?: string;        // guidance line for the active issue
}

export interface SeedResult {
  tool: 'seed';
  count: number;
  countBand: [number, number];
  livePct: number;
  sizeCv: number;
  stage: 'Nauplius' | 'Zoea' | 'Mysis' | 'PL';
  plStage?: number;
  confidence: number;
  source: 'device' | 'server';
  modelVersion: string;
  invoiceMismatch?: { field: 'count' | 'stage' | 'quality'; expected: number; got: number };
}

export interface DiseaseResult {
  tool: 'disease';
  risk: RiskLevel;
  signals: { label: string; score: number }[];
  confidence: number;
  heatmapUrl?: string;
  source: 'device' | 'server';
  modelVersion: string;
}

export interface WaterResult {
  tool: 'water';
  risk: RiskLevel;
  limiting?: string;
  readings: Record<string, number>;
  guidance: string;
}

export type ToolResult = SeedResult | DiseaseResult | WaterResult;

export interface ToolRecord {
  recordId: string;
  certificateId: string;
  tool: ToolId;
  result: ToolResult;
  createdAt: string;   // ISO
  synced: boolean;
  qrUrl: string;
}
