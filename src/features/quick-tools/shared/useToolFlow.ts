import { useState } from 'react';
import type { FlowStep, ToolResult } from '@/features/quick-tools/types';

/**
 * Shared state machine for all three Quick Tools:
 * idle → capturing → processing → result → saved
 *                  ↘ retake (quality / low confidence)
 *                  ↘ offlineQueued (saved with no signal)
 */
export function useToolFlow() {
  const [step, setStep] = useState<FlowStep>('idle');
  const [result, setResult] = useState<ToolResult | null>(null);

  function reset() {
    setResult(null);
    setStep('idle');
  }

  return { step, setStep, result, setResult, reset };
}
